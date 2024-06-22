import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, filter, take, tap } from 'rxjs';
import { UserNotification } from 'src/app/core/models/user-notification.model';
import { NotificationService } from 'src/app/core/services/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-notification-unread-count',
  templateUrl: './notification-unread-count.component.html',
  styleUrls: ['./notification-unread-count.component.scss']
})
export class NotificationUnreadCountComponent implements OnInit {
  counter = 0;
  @Input() updateNotification$!: Observable<UserNotification | null | "all">;
  @Input() removeNotification$!: Observable<UserNotification | null>;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.getUnreadCount().pipe(
      take(1),
      tap((amount) => {
        this.counter = amount;
      }),
      untilDestroyed(this)
    ).subscribe();

    this.notificationService.getNewNotification().pipe(
      tap(() => {
        this.counter += 1;
      }),
      untilDestroyed(this)
    ).subscribe();

    this.updateNotification$.pipe(
      filter((notification) => !!notification),
      tap((notification) => {
        if (notification === "all") {
          this.counter = 0;
        } else {
          const updatedNotification = notification as UserNotification;
          this.counter += updatedNotification.is_read ? -1 : 1;
        }
      }),
      untilDestroyed(this)
    ).subscribe();

    this.removeNotification$.pipe(
      filter((notification) => !!notification),
      tap((notification) => {
        const removedNotification = notification as UserNotification;
        if (!removedNotification.is_read) {
          this.counter -= 1;
        }
      }),
      untilDestroyed(this)
    ).subscribe()
  }
}
