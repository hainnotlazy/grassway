import { Component, Input } from '@angular/core';
import { NotificationType } from 'src/app/core/models/user-notification.model';

@Component({
  selector: 'app-notification-icon',
  templateUrl: './notification-icon.component.html',
  styleUrls: ['./notification-icon.component.scss']
})
export class NotificationIconComponent {
  @Input() type!: NotificationType;
}
