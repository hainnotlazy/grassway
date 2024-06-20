import { Injectable } from '@angular/core';
import { NotificationSocket } from '../sockets/notification.socket';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private socket: NotificationSocket
  ) {}

  connect() {
    this.socket.connect();
  }
}
