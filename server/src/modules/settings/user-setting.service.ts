import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSetting } from 'src/entities/user-setting.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserSettingDto } from './dtos/user-setting.dto';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from 'src/entities/user-notification.entity';

@Injectable()
export class UserSettingService {
  constructor(
    @InjectRepository(UserSetting)
    private readonly userSettingRepository: Repository<UserSetting>,
    private notificationService: NotificationService,
    private uploadFileService: UploadFileService
  ) {}

  /**
   * Describe: Get user setting
  */
  async getUserSetting(currentUser: User) {
    const userSettingExisted = await this.userSettingRepository.findOne({
      where: {
        user: {
          id: currentUser.id
        }
      }
    });

    if (!userSettingExisted) {
      const userSetting = this.userSettingRepository.create({
        user: currentUser
      });
      return await this.userSettingRepository.save(userSetting);
    }

    return userSettingExisted;
  }

  /**
   * Describe: Update user setting
  */
  async updateUserSetting(
    currentUser: User, 
    userSettingDto: UserSettingDto,
    logo: Express.Multer.File
  ) {
    let userSettingExisted = await this.userSettingRepository.findOne({
      where: {
        user: {
          id: currentUser.id
        }
      }
    });

    Object.assign(userSettingExisted, userSettingDto);

    // Save logo
    if (logo) {
      const savedLogoPath = this.uploadFileService.saveLogo(logo);

      userSettingExisted.qr_code_logo_url && this.uploadFileService.removeOldFile(userSettingExisted.qr_code_logo_url);
      userSettingExisted.qr_code_logo_url = savedLogoPath;
    }

    const savedUserSetting = await this.userSettingRepository.save(userSettingExisted);

    // Push notification
    await this.notificationService.createNewNotification(
      currentUser,
      {
        title: "QR settings updated",
        description: "You have updated QR settings successfully",
        type: NotificationType.UPDATE_SETTINGS
      }
    )
    return savedUserSetting;
  }
}
