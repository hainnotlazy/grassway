import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadFileService: UploadFileService
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

  /** Describe: Find user by email, github, facebook or slack */
  async findUserByThirdParty(
    provider: "email" | "github" | "facebook" | "slack", 
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

  async saveUser(user: User) {
    return await this.userRepository.save(user);
  }

  async updateUserLinkedAccount(user: User, provider: "email" | "facebook" | "github" | "slack", value: string) {
    user[provider] = value;
    return this.userRepository.save(user);
  }
}
