import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, filter, finalize, scan, shareReplay, startWith, switchMap, take, tap } from 'rxjs';
import { GetNotificationOptions } from 'src/app/core/interfaces/get-notifications-options.interface';
import { NotificationResponse } from 'src/app/core/interfaces/notification-response.interface';
import { UserNotification } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  host: {
    class: 'relative',
  }
})
export class NotificationComponent implements OnInit {
  isProcessing = false;
  isNotificationMenuOpen = false;
  totalItems = 0;
  currentPage = 1;
  totalPages = 1;
  isInitialLoad = false;
  isLoading = false;
  hasLoadingError = false;

  private getNotificationsOptions: GetNotificationOptions = {
    limit: 20,
    page: 1
  };

  private listNotificationsSubject = new BehaviorSubject<NotificationResponse | null>(null);
  private listNotifications$ = this.listNotificationsSubject.asObservable();

  updateNotificationSubject = new BehaviorSubject<UserNotification | null | "all">(null);
  updateNotification$ = this.updateNotificationSubject.asObservable();

  removeNotificationSubject = new BehaviorSubject<UserNotification | null>(null);
  removeNotification$ = this.removeNotificationSubject.asObservable();
  private removedNotificationId: number[] = [];

  notifications$ = combineLatest([
    this.listNotifications$,
    this.notificationService.getNewNotification().pipe(startWith(null)),
    this.updateNotification$,
    this.removeNotification$
  ]).pipe(
    filter(([notification]) => !!notification),
    tap(([notification, newNotification]) => {
      const responseMeta = (notification as NotificationResponse).meta;
      this.totalItems = responseMeta.totalItems;
      this.currentPage = responseMeta.currentPage;
      this.totalPages = responseMeta.totalPages;

      if (this.totalItems === 0 && newNotification) {
        this.totalItems = 1;
      }
    }),
    scan((accumulator: UserNotification[], [notifications, newNotification, updatedNotification, removedNotification]) => {
      accumulator = [...accumulator, ...(notifications as NotificationResponse).data];

      // Add new notification
      if (newNotification) {
        accumulator = [newNotification, ...accumulator];
      }

      // Update notification
      if (updatedNotification && updatedNotification !== "all") {
        accumulator = accumulator.map(notification => {
          if (notification.id === updatedNotification.id) {
            return updatedNotification;
          }
          return notification;
        });
      }

      // Remove notification
      if (removedNotification) {
        this.removedNotificationId.push(removedNotification.id);
      }
      accumulator = accumulator.filter(notification => !this.removedNotificationId.includes(notification.id));

      // Remove duplicate notification
      accumulator = this.removeDuplicateNotification(accumulator);

      return accumulator;
    }, []),
    tap(() => {
      if (this.isLoading && this.isInitialLoad) {
        this.isLoading = false;
      }
      this.isInitialLoad = true;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.notificationService.listNotifications(this.getNotificationsOptions).pipe(
      tap(response => {
        this.listNotificationsSubject.next(response);
      }, () => {
        this.hasLoadingError = true;
      }),
      untilDestroyed(this),
    ).subscribe();
  }

  onScrollDown() {
    if (
      this.isInitialLoad
      && !this.isLoading
      && this.currentPage < this.totalPages
    ) {
      this.isLoading = true;
      this.getNotificationsOptions.page++;
      this.notificationService.listNotifications(this.getNotificationsOptions).pipe(
        tap(response => {
          this.listNotificationsSubject.next(response);
        }, () => {
          this.hasLoadingError = true;
        }),
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
      tap((notifications: UserNotification[]) => {
        for (const notification of notifications) {
          notification.is_read = true;
          this.updateNotificationSubject.next(notification);
        }
        this.updateNotificationSubject.next("all");
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
}
