import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Put("update-profile")
  @UseInterceptors(FileInterceptor("avatar")) 
  async updateProfile(
    @CurrentUser() currentUser: User, 
    @Body() body: UpdateProfileDto, 
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.usersService.updateUserProfile(currentUser, body, avatar);
  }
}
