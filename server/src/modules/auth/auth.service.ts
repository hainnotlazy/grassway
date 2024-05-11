import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { RedisService } from 'src/shared/services/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService
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

  async logout(currentUser: User, accessToken: string, tokenExpirationTime: number) {
    return this.redisService.setKey({
      key: accessToken,
      value: currentUser.id.toString(),
      expiresIn: this.getTimeLeft(tokenExpirationTime)
    })
  }

  async isTokenBlacklisted(accessToken: string) {
    return !!(await this.redisService.getKey({
      key: accessToken
    }));
  }

  private getTimeLeft(expirationTime: number) {
    const now = Math.floor(new Date().getTime() / 1000);

    return expirationTime > now ? expirationTime - now : 0;
  }
}
