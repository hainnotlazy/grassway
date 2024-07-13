export enum NotificationType {
  INFORMATION = "information",
  CONGRATULATION = "congratulation",
  UPDATE_PROFILE = "update_profile",
  UPDATE_SETTINGS = "update_settings",
  BRAND_CREATED = "brand_created",
  BRAND_INVITATION = "brand_invitation",
  BRAND_MEMBER_JOINED = "brand_member_joined",
  BRAND_MEMBER_LEFT = "brand_member_left",
  BRAND_DESTROYED = "brand_member_removed",
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
