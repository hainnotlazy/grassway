import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService
  ) {}

  @Get()
  async listNotifications(
    @CurrentUser() currentUser: User,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return await this.notificationService.listNotifications(currentUser, {
      page,
      limit
    });
  }
}
