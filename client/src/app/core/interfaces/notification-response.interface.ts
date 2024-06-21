import { UserNotification } from "../models/user-notification.model";

export interface NotificationResponse {
  data: UserNotification[];
  meta: {
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number
  },
  link: {
    current: string,
    next?: string;
    previous?: string,
    first?: string,
    last?: string
  }
}
