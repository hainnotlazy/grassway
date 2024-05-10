import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async createUser(registerUserDto: RegisterUserDto) {
    // Check if username or email already exists
    const { username, email } = registerUserDto;
    if (await this.userRepository.findOneBy({ username })) {
      throw new BadRequestException('Username already exists');
    } else if (await this.userRepository.findOneBy({ email })) {
      throw new BadRequestException('Email already exists');
    }

    // Handled hash password in entity layer
    const newUser = this.userRepository.create(registerUserDto);
    return await this.userRepository.save(newUser);
  }
}
