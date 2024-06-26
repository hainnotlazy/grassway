import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { UserNotification } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services';

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

  @Input() notification!: UserNotification;

  @Input() updateNotificationSubject!: BehaviorSubject<UserNotification | null | "all">;
  @Input() removeNotificationSubject!: BehaviorSubject<UserNotification | null>;

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
      tap((updatedNotification) => this.updateNotificationSubject.next(updatedNotification)),
      finalize(() => (this.isProcessing = false)),
      untilDestroyed(this)
    ).subscribe();
  }

  onDelete() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.notificationService.deleteNotification(this.notification.id).pipe(
      tap(() => this.removeNotificationSubject.next(this.notification)),
      finalize(() => (this.isProcessing = false)),
      untilDestroyed(this)
    ).subscribe();
  }
}
