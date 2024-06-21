import { Injectable } from '@angular/core';
import { NotificationSocket } from '../sockets/notification.socket';
import { UserNotification } from '../models/user-notification.model';
import { HttpClient } from '@angular/common/http';
import { NotificationResponse } from '../interfaces/notification-response.interface';
import { GetNotificationOptions } from '../interfaces/get-notifications-options.interface';

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

  getNewNotification() {
    return this.socket.fromEvent<UserNotification>(this.NEW_NOTIFICATION_EVENT_NAME);
  }
}
