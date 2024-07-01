import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigOptions } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotification]),
    JwtModule.registerAsync({
      useClass: JwtConfigOptions
    }),
    SharedModule
  ],
  controllers: [
    NotificationController
  ],
  providers: [
    NotificationService, 
    NotificationGateway
  ],
  exports: [
    NotificationService
  ]
})
export class NotificationModule {}
