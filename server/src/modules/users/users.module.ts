import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UrlsModule } from '../urls/urls.module';
import { UserNotification } from 'src/entities/user-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserNotification]),
    UrlsModule,
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
