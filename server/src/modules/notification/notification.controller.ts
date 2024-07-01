import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CurrentUser } from 'src/common/decorators';
import { User, UserNotification } from 'src/entities';
import { ChangeNotificationStatusDto } from './dtos';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(
    private notificationService: NotificationService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get paginated list of notifications" })
  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: "Get paginated list of notifications",
    type: [UserNotification]
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  listNotifications(
    @CurrentUser() currentUser: User,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.notificationService.listNotifications(currentUser, {
      page,
      limit
    });
  }

  @Get("/unread-count")
  @ApiOperation({ summary: "Get unread notifications count" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get unread notifications count",
    type: Number
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getUnreadCount(@CurrentUser() currentUser: User) {
    return this.notificationService.getUnreadCount(currentUser);
  }

  @Put("/bulk/change-status")
  @HttpCode(204)
  @ApiOperation({ summary: "Bulk change notification status" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Bulk change notification status successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async bulkChangeNotificationStatus(
    @CurrentUser() currentUser: User,
    @Body() changeNotificationStatusDto: ChangeNotificationStatusDto
  ) {
    await this.notificationService.bulkChangeNotificationStatus(currentUser, changeNotificationStatusDto);
    return;
  }

  @Put("/:id/change-status")
  @ApiOperation({ summary: "Change notification status" })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiResponse({
    status: 404,
    description: "Not found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Notification not found": {
            value: "Notification not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  changeNotificationStatus(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) id: number,
    @Body() changeNotificationStatusDto: ChangeNotificationStatusDto
  ) {
    return this.notificationService.changeNotificationStatus(
      currentUser, 
      id, 
      changeNotificationStatusDto
    );
  }

  @Delete("/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete notification" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Delete notification successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async deleteNotification(
    @CurrentUser() currentUser: User,
    @Param("id", ParseIntPipe) id: number
  ) {
    await this.notificationService.deleteNotification(currentUser, id);
    return;
  }
}
