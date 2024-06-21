import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from 'src/entities/user-notification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { GetNotificationsOptions } from 'src/common/models/get-notifications-options.model';
import { paginate } from 'nestjs-paginate';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserNotification)
    private userNotificationRepository: Repository<UserNotification>,
    private notificationGateway: NotificationGateway,
  ) {}

  /**
   * Describe: Get paginated notifications by user
   */
  async listNotifications(currentUser: User, options: GetNotificationsOptions) {
    const { page, limit } = options;

    // Create query builder
    const queryBuilder = this.userNotificationRepository.createQueryBuilder("notifications")
      .where("notifications.user = :userId", { userId: currentUser.id })

    return paginate({
      limit,
      page,
      path: "/api/notifications",
      select: [
        "id",
        "title",
        "description",
        "type",
        "is_read",
        "created_at"
      ],
      sortBy: [
        ["id", "DESC"]
      ]
    }, queryBuilder, {
      sortableColumns: ["id"],
      maxLimit: 50,
    })
  }

  /**
   * Describe: Create new notification
   */
  async createNewNotification(
    user: User, 
    createNotificationDto: CreateNotificationDto, 
    pushToClient: boolean = true
  ) {
    const {
      title, description, type
    } = createNotificationDto;

    const newNotification = this.userNotificationRepository.create({
      title,
      description,
      type,
      user
    });
    const savedNotification = await this.userNotificationRepository.save(newNotification);

    // Push new notification to client
    if (pushToClient) {
      await this.notificationGateway.emitNewNotification(user.id, savedNotification);
    }

    return savedNotification;
  }
}
