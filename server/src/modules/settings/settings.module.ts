import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from 'src/entities/user-setting.entity';
import { User } from 'src/entities/user.entity';
import { UserSettingService } from './user-setting.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSetting]),
    SharedModule
  ],
  controllers: [SettingsController],
  providers: [UserSettingService]
})
export class SettingsModule {}
