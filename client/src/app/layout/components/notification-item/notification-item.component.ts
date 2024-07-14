import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, finalize, map, Observable, switchMap, take, tap } from 'rxjs';
import { GetNotificationOptions } from 'src/app/core/interfaces';
import { UserNotification } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services';
import { NotificationUnreadCountComponent } from '../notification-unread-count/notification-unread-count.component';

@UntilDestroy()
@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
  host: {
    class: "block"
  }
})
export class NotificationItemComponent {
  isProcessing = false;

  @ViewChild("actionButton") actionButton!: ElementRef;
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  @Input() notification!: UserNotification;
  @Input() getNotificationsOptions!: GetNotificationOptions;
  @Input() notificationsSubject!: BehaviorSubject<UserNotification[]>;
  @Input() notifications$!: Observable<UserNotification[]>;
  @Input() unreadCountComponent!: NotificationUnreadCountComponent;

  constructor(
    private notificationService: NotificationService,
  ) {}

  onClickNotification($event: Event) {
    $event.stopPropagation();

    if (this.actionButton.nativeElement.contains($event.target)) {
      return;
    }

    this.onChangeStatus(true);
  }

  onChangeStatus(status: boolean) {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.notificationService.changeNotificationStatus(
      this.notification.id,
      status
    ).pipe(
      tap(updatedNotification => {
        if (updatedNotification.is_read) {
          this.unreadCountComponent.decreaseCounter();
        } else {
          this.unreadCountComponent.increaseCounter();
        }
        Object.assign(this.notification, updatedNotification);
      }),
      switchMap(() => this.notifications$),
      take(1),
      map(response => response as UserNotification[]),
      map(notifications => {
        return notifications.map(notification => {
          if (notification.id === this.notification.id) {
            return this.notification;
          }
          return notification;
        })
      }),
      tap(notifications => this.notificationsSubject.next(notifications)),
      finalize(() => {
        this.isProcessing = false;
        this.menuTrigger.closeMenu();
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onDelete() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.notificationService.deleteNotification(this.notification.id).pipe(
      tap(() => {
        if (!this.notification.is_read) {
          this.unreadCountComponent.decreaseCounter();
        }
      }),
      switchMap(() => this.notifications$),
      take(1),
      map(response => response as UserNotification[]),
      map(notifications => notifications.filter(
        notification => notification.id !== this.notification.id
      )),
      tap(notifications => {
        // Calculate current page after removed notification
        const limit = this.getNotificationsOptions.limit;
        const totalItems = notifications.length;
        const currentPage = Math.floor(totalItems / limit);

        Object.assign(this.getNotificationsOptions, {
          page: currentPage
        });

        this.notificationsSubject.next(notifications);
      }),
      finalize(() => {
        this.isProcessing = false;
        this.menuTrigger.closeMenu();
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
