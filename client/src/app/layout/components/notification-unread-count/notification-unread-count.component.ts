import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap } from 'rxjs';
import { NotificationService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-notification-unread-count',
  templateUrl: './notification-unread-count.component.html',
  styleUrls: ['./notification-unread-count.component.scss']
})
export class NotificationUnreadCountComponent {
  counter = 0;

  constructor(
    private notificationService: NotificationService
  ) {
    this.notificationService.getUnreadCount().pipe(
      take(1),
      tap((amount) => {
        this.counter = amount;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  increaseCounter() {
    this.counter += 1;
  }

  decreaseCounter() {
    this.counter -= 1;
  }

  resetCounter() {
    this.counter = 0;
  }
}
