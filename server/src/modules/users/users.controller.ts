import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get("my-profile")
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get("/:id")
  async getUserById(@Param("id") id: string) {
    return await this.usersService.findUser(id);
  }
}
