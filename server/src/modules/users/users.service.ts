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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadFileService: UploadFileService,
    private mailerServer: MailerService
  ) {}

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

  /** Describe: Find user by username or email */
  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username }) 
      || await this.userRepository.findOneBy({ email: username });
    
    if (!user) {
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

  async createUser(registerUserDto: Partial<User>) {
    // Check if username or email already exists
    const { username, email } = registerUserDto;
    if (await this.userRepository.findOneBy({ username })) {
      throw new BadRequestException('Username already exists');
    } else if (email && await this.userRepository.findOneBy({ email })) {
      throw new BadRequestException('Email already exists');
    }

    // Handled hash password in entity layer
    const newUser = this.userRepository.create(registerUserDto);
    return await this.userRepository.save(newUser);
  }

  async updateUserProfile(currentUser: User, updateProfileDto: UpdateProfileDto, avatar: Express.Multer.File) {
    // Save new avatar & remove old one
    if (avatar) {
      const savedAvatar = this.uploadFileService.saveAvatar(avatar);
      currentUser.avatar && this.uploadFileService.removeOldAvatar(currentUser.avatar);
      updateProfileDto.avatar = savedAvatar;
    }

    // Update user
    Object.assign(currentUser, updateProfileDto);

    return await this.userRepository.save(currentUser);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException("Password is incorrect");
    }

    user.password = bcrypt.hashSync(newPassword, SALT_ROUNDS);
    return await this.userRepository.save(user);
  }

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

  async saveUser(user: User) {
    return await this.userRepository.save(user);
  }

  async updateUserLinkedAccount(user: User, provider: "email" | "facebook" | "github" | "twitter", value: string) {
    user[provider] = value;
    return this.userRepository.save(user);
  }
}
