import { Component, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, finalize, map, of, switchMap, take, tap } from 'rxjs';
import { GetNotificationOptions, NotificationResponse } from 'src/app/core/interfaces';
import { UserNotification } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services';
import { NotificationUnreadCountComponent } from '../notification-unread-count/notification-unread-count.component';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  host: {
    class: 'relative',
  }
})
export class NotificationComponent {
  isProcessing = false;
  isNotificationMenuOpen = false;
  totalItems = 0;
  currentPage = 1;
  totalPages = 1;
  isLoading = false;
  hasLoadingError = false;

  @ViewChild(NotificationUnreadCountComponent) unreadCountComponent!: NotificationUnreadCountComponent;

  getNotificationsOptions: GetNotificationOptions = {
    limit: 20,
    page: 1
  };

  notificationsSubject = new BehaviorSubject<UserNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable().pipe(
    map(notifications => this.removeDuplicateNotification(notifications))
  );

  constructor(
    private notificationService: NotificationService
  ) {
    this.notificationService.listNotifications(this.getNotificationsOptions).pipe(
      tap(response => {
        this.setPaginatedPage(response);
        this.notificationsSubject.next(response.data);
      }, () => {
        this.hasLoadingError = true;
      }),
      untilDestroyed(this),
    ).subscribe();

    this.notificationService.getNewNotification().pipe(
      switchMap(newNotification => this.notifications$.pipe(
        take(1),
        map(currentNotifications => [newNotification, ...currentNotifications]),
      )),
      tap(notifications => {
        // Calculate current page after get new notification
        const limit = this.getNotificationsOptions.limit;
        const totalItems = notifications.length;
        const currentPage = Math.floor(totalItems / limit);

        Object.assign(this.getNotificationsOptions, {
          page: currentPage
        });

        this.notificationsSubject.next(notifications);
        this.unreadCountComponent.increaseCounter();
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onScrollDown() {
    if (!this.isLoading && this.currentPage < this.totalPages) {
      this.isLoading = true;
      this.getNotificationsOptions.page++;
      this.notificationService.listNotifications(this.getNotificationsOptions).pipe(
        map(response => {
          this.setPaginatedPage(response);
          return response.data;
        }),
        switchMap(notifications => this.notifications$.pipe(
          take(1),
          map(currentNotifications => [...currentNotifications, ...notifications]),
        )),
        tap(notifications => this.notificationsSubject.next(notifications)),
        catchError(error => {
          this.hasLoadingError = true;
          return of(error);
        }),
        finalize(() => this.isLoading = false),
        untilDestroyed(this),
      ).subscribe();
    }
  }

  onBulkChangeStatus() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.notificationService.changeAllNotificationStatus(true).pipe(
      switchMap(() => this.notifications$),
      take(1),
      map(notifications => notifications.map(notification => {
        notification.is_read = true;
        return notification;
      })),
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.unreadCountComponent.resetCounter();
      }),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this)
    ).subscribe()
  }

  private removeDuplicateNotification(notifications: UserNotification[]) {
    return notifications.filter((source, index, self) =>
      index === self.findIndex(s => s.id === source.id)
    );
  };

  private setPaginatedPage(response: NotificationResponse) {
    const responseMeta = response.meta;
    this.totalItems = responseMeta.totalItems;
    this.currentPage = responseMeta.currentPage;
    this.totalPages = responseMeta.totalPages;
  }
}
