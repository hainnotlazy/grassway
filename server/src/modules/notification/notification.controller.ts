import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { ChangeNotificationStatusDto } from './dtos/change-notification-status.dto';

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

  @Get("/unread-count")
  async getUnreadCount(@CurrentUser() currentUser: User) {
    return this.notificationService.getUnreadCount(currentUser);
  }

  @Put("/bulk/change-status")
  @HttpCode(204)
  async bulkChangeNotificationStatus(
    @CurrentUser() currentUser: User,
    @Body() body: ChangeNotificationStatusDto
  ) {
    await this.notificationService.bulkChangeNotificationStatus(currentUser, body);
    return "";
  }

  @Put("/:id/change-status")
  async changeNotificationStatus(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() body: ChangeNotificationStatusDto
  ) {
    return await this.notificationService.changeNotificationStatus(currentUser, id, body);
  }

  @Delete("/:id")
  @HttpCode(204)
  async deleteNotification(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    await this.notificationService.deleteNotification(currentUser, id);
    return "";
  }
}
