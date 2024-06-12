import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { UserSettingDto } from './dtos/user-setting.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('settings')
export class SettingsController {
  constructor(
    private userSettingService: UserSettingService
  ) {}

  @Get("user")
  getUserSetting(@CurrentUser() currentUser: User) {
    return this.userSettingService.getUserSetting(currentUser);
  }

  @Post("user")
  @UseInterceptors(FileInterceptor('logo'))
  updateUserSetting(
    @CurrentUser() currentUser: User,
    @Body() body: UserSettingDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.userSettingService.updateUserSetting(currentUser, body, logo);
  }
}
