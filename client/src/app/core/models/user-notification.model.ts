export enum NotificationType {
  INFORMATION = "information",
  CONGRATULATION = "congratulation",
  UPDATE_PROFILE = "update_profile",
  UPDATE_SETTINGS = "update_settings",
}

export interface UserNotification {
  id: number;
  user_id: number;
  title: string;
  description: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}
