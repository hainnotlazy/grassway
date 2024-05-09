import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService
  ) {}

  @Post("register")
  async registerAccount(@Body() body: RegisterUserDto) {
    return await this.userService.createUser(body);
  }
}
