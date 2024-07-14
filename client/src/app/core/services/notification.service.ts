import { Injectable } from '@angular/core';
import { UserNotification } from '../models';
import { HttpClient } from '@angular/common/http';
import { NotificationResponse, GetNotificationOptions } from '../interfaces';
import { NotificationSocket } from '../sockets';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly NEW_NOTIFICATION_EVENT_NAME = "NewNotification";
  constructor(
    private httpClient: HttpClient,
    private socket: NotificationSocket
  ) {}

  listNotifications(options: GetNotificationOptions) {
    const {
      limit,
      page
    } = options;

    return this.httpClient.get<NotificationResponse>(`api/notification?page=${page}&limit=${limit}`);
  }

  getUnreadCount() {
    return this.httpClient.get<number>("api/notification/unread-count");
  }

  getNewNotification() {
    return this.socket.fromEvent<UserNotification>(this.NEW_NOTIFICATION_EVENT_NAME);
  }

  changeNotificationStatus(id: number, isRead: boolean) {
    return this.httpClient.put<UserNotification>(`api/notification/${id}/change-status`, {
      is_read: isRead
    });
  }

  changeAllNotificationStatus(isRead: boolean) {
    return this.httpClient.put(`api/notification/bulk/change-status`, {
      is_read: isRead
    });
  }

  deleteNotification(id: number) {
    return this.httpClient.delete<void>(`api/notification/${id}`);
  }
}
