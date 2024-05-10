import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateLogin(username: string, password: string) {
    const user = await this.usersService.findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }

    throw new BadRequestException("Username or password is incorrect");
  }

  async generateAccessToken(user: Partial<User>) {
    return this.jwtService.sign({
      userId: user.id,
      username: user.username,
      isActive: user.is_active
    })
  }
}
