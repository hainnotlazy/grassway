import { NotificationType } from "src/entities/user-notification.entity";

export class CreateNotificationDto {
  title: string;

  description?: string;

  type?: NotificationType;
}