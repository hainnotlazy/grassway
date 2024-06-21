import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, filter, scan, startWith, tap } from 'rxjs';
import { GetNotificationOptions } from 'src/app/core/interfaces/get-notifications-options.interface';
import { NotificationResponse } from 'src/app/core/interfaces/notification-response.interface';
import { UserNotification } from 'src/app/core/models/user-notification.model';
import { NotificationService } from 'src/app/core/services/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
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
  listNotifications$ = this.listNotificationsSubject.asObservable();

  notifications$ = combineLatest([
    this.listNotifications$,
    this.notificationService.getNewNotification().pipe(startWith(null))
  ]).pipe(
    filter(([notification]) => !!notification),
    tap(([notification]) => {
      const responseMeta = (notification as NotificationResponse).meta;
      this.currentPage = responseMeta.currentPage;
      this.totalPages = responseMeta.totalPages;
    }),
    scan((accumulator: UserNotification[], [notifications, newNotification]) => {
      accumulator = [...accumulator, ...(notifications as NotificationResponse).data];

      if (newNotification) {
        accumulator = [newNotification, ...accumulator];
      }

      // Remove duplicate notification
      accumulator = this.removeDuplicateNotification(accumulator);

      return accumulator;
    }, []),
    tap(() => {
      if (this.isLoading && this.isInitialLoad) {
        this.isLoading = false;
      }
      this.isInitialLoad = true;
    })
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

  private removeDuplicateNotification(notifications: UserNotification[]) {
    return notifications.filter((source, index, self) =>
      index === self.findIndex(s => s.id === source.id)
    );
  };
}
