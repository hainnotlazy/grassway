import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    SharedModule
  ],
  controllers: [
    NotificationController
  ],
  providers: [
    NotificationService, 
    NotificationGateway
  ]
})
export class NotificationModule {}
