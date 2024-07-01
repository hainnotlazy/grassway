import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserNotification } from 'src/entities';
import { SharedModule } from 'src/shared/shared.module';
import { UrlsModule } from '../urls/urls.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserNotification]),
    UrlsModule,
    NotificationModule,
    SharedModule,
  ],
  controllers: [
    UsersController
  ],
  providers: [
    UsersService
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
