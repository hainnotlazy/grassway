import { ChangePasswordDto } from './dtos/change-password.dto';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants/bcrypt.const';
import { UrlsService } from '../urls/urls.service';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { NotificationType, UserNotification } from 'src/entities/user-notification.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserNotification)
    private userNotificationRepository: Repository<UserNotification>,
    private urlService: UrlsService,
    private notificationService: NotificationService,
    private uploadFileService: UploadFileService,
    private mailerServer: MailerService
  ) {}

  /** Describe: Find user by id */
  async findUser(id: string) {
    // Try to parse id's type to number
    let userId = parseInt(id);
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user id');
    }

    // Find user
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /** Describe: Find user by username or email 
   * @param findByEmail - If true, find the user by both username and email; otherwise, find by username only.
   * @param throwError - If true, throw an error if the user is not found.
  */
  async findUserByUsername(username: string, findByEmail: boolean = true, throwError: boolean = true) {
    let user: User = null;

    if (findByEmail) {
      user = await this.userRepository.findOneBy({ username }) 
      || await this.userRepository.findOneBy({ email: username });
    } else {
      user = await this.userRepository.findOneBy({ username });
    }

    if (!user && throwError === true) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  /** Describe: Find user by email, github, facebook or twitter */
  async findUserByThirdParty(
    provider: "email" | "github" | "facebook" | "twitter", 
    value: string
  ) {
    return await this.userRepository.findOneBy({ [provider]: value });
  }

  /** Describe: Create new user */
  async createUser(registerUser: Partial<User>, refLinksId: number[] = []) {
    // Check if username or email already exists
    const { username, email } = registerUser;
    if (await this.userRepository.findOneBy({ username })) {
      throw new BadRequestException('Username already exists');
    } else if (email && await this.userRepository.findOneBy({ email })) {
      throw new BadRequestException('Email already exists');
    }

    // Handled hash password in entity layer
    const newUser = this.userRepository.create(registerUser);
    const savedUser = await this.userRepository.save(newUser);

    // Save notification
    const newNotification = this.userNotificationRepository.create({
      user: savedUser,
      title: "Welcome to Grassway! 🎉",
      description: "Let's get started with your first link.",
      type: NotificationType.CONGRATULATION
    })
    await this.userNotificationRepository.save(newNotification);

    // Handle to save referral links
    if (refLinksId.length > 0) {
      await this.urlService.saveRefLinks(savedUser, refLinksId);
    }

    // Handle sending verification email
    if (email && !savedUser.is_email_verified) {
      await this.mailerServer.sendMail({
        to: savedUser.email,
        subject: "[Grassway] Verify your email",
        template: "verification-email",
        context: {
          username: savedUser.username,
          verificationCode: savedUser.email_verification_code
        }
      });
    }

    return savedUser;
  }

  /** Describe: Update user */
  async updateUserProfile(currentUser: User, updateProfileDto: UpdateProfileDto, avatar: Express.Multer.File) {
    // Save new avatar & remove old one
    if (avatar) {
      const savedAvatar = this.uploadFileService.saveAvatar(avatar);
      currentUser.avatar && this.uploadFileService.removeOldFile(currentUser.avatar);
      updateProfileDto.avatar = savedAvatar;
    }

    // Update user
    Object.assign(currentUser, updateProfileDto);
    const updatedUser = await this.userRepository.save(currentUser);

    // Push notification
    await this.notificationService.createNewNotification(
      updatedUser, 
      {
        title: "Updated profile successfully",
        description: "You have successfully updated your profile.",
        type: NotificationType.UPDATE_PROFILE
      }
    )

    return updatedUser;
  }

  /** Describe: Change password */
  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException("Password is incorrect");
    }

    user.password = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    return await this.userRepository.save(user);
  }

  /** Describe: Forget password */
  async forgetPassword(email: string) {
    const existedUser = await this.userRepository.findOneBy({ email });
    if (!existedUser) { 
      throw new NotFoundException("User not found");
    }

    // Check if user can resend reset pw code
    const remainingTimeToResendCode = Math.max(0, new Date(existedUser.next_forget_password_time).getTime() - new Date().getTime());
    if (remainingTimeToResendCode !== 0) {
      return existedUser;
    }

    // Send email contain reset pw code
    const resetPwCode = Math.floor(100000 + Math.random() * 900000);
    const sentMail = await this.mailerServer.sendMail({
      to: existedUser.email,
      subject: "[Grassway] Reset your password",
      template: "forget-password",
      context: {
        username: existedUser.username,
        resetCode: resetPwCode
      }
    });

    if (sentMail?.accepted?.length > 0) {
      existedUser.reset_password_code = resetPwCode;
      existedUser.next_forget_password_time = new Date(new Date().getTime() + (15 * 60 * 1000));
      return await this.userRepository.save(existedUser);
    }
    throw new InternalServerErrorException("Somethings went wrong when sending reset password mail!");
  }

  /** Describe: Reset password */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, new_password: newPassword } = resetPasswordDto;
    const existedUser = await this.userRepository.findOneBy({ email });

    if (!existedUser) { 
      throw new NotFoundException("User not found");
    }

    if (existedUser.reset_password_code.toString() !== code) {
      throw new BadRequestException("Invalid reset code");
    }

    existedUser.password = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    existedUser.reset_password_code = null;
    existedUser.next_forget_password_time = null;
    return await this.userRepository.save(existedUser);
  }

  /** Describe: Send verification email */
  async sendVerificationEmailMail(user: User) {
    if (!user.email) {
      throw new BadRequestException("User don't have email to verify");
    } else if (user.is_email_verified) {
      throw new BadRequestException("Email already verified");
    }

    // Check if user can resend verification code
    const remainingTimeToResendCode = Math.max(0, new Date(user.next_email_verification_time).getTime() - new Date().getTime());
    if (remainingTimeToResendCode !== 0) {
      throw new BadRequestException("Please wait a while before requesting a resend of the verification code!");
    }

    const sentMail = await this.mailerServer.sendMail({
      to: user.email,
      subject: "[Grassway] Verify your email",
      template: "verification-email",
      context: {
        username: user.username,
        verificationCode: user.email_verification_code
      }
    });

    if (sentMail?.accepted?.length > 0) {
      user.next_email_verification_time = new Date(new Date().getTime() + (15 * 60 * 1000));
      return await this.userRepository.save(user);
    } 
    throw new InternalServerErrorException("Somethings went wrong when sending verification mail!");
  }

  /** Describe: Verify email */
  async verifyEmail(user: User, verifyEmailDto: VerifyEmailDto) {
    const { code } = verifyEmailDto;

    // Validate verification code
    const codeNumber = parseInt(code);
    if (isNaN(codeNumber)) {
      throw new BadRequestException("Invalid verification code");
    }

    if (!user.email) {
      throw new BadRequestException("User don't have email to verify");
    } else if (user.is_email_verified) {
      throw new BadRequestException("Email already verified");
    } else if (user.email_verification_code !== codeNumber) {
      throw new BadRequestException("Verification code is incorrect");
    }

    // Update user
    user.is_email_verified = true;
    user.email_verification_code = null;
    user.next_email_verification_time = null;

    return await this.userRepository.save(user);
  }

  /** Describe: Save user entity */
  async saveUser(user: User) {
    return await this.userRepository.save(user);
  }

  /** Describe: Update user's linked account */
  async updateUserLinkedAccount(user: User, provider: "email" | "facebook" | "github" | "twitter", value: string) {
    user[provider] = value;

    if (provider === "email") {
      user.is_email_verified = true;
    }

    return this.userRepository.save(user);
  }
}
