import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  private subscription?: Subscription;
  private readonly MONTH_NAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  transform(value: Date): Observable<string> {
    if (typeof value !== "object") {
      value = new Date(value);
    }
    const time = value.getTime();

    return new Observable<string>(observer => {
      this.subscription = timer(0, 1000).subscribe(() => {
        const currentTime = new Date().getTime();
        const difference = currentTime - time;

        const seconds = Math.floor(difference / 1000);
        if (seconds < 60) {
          observer.next('now');
          return;
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
          observer.next(minutes === 1 ? '1 min ago' : `${minutes} mins ago`);
          return;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          observer.next(hours === 1 ? '1 hour ago' : `${hours} hours ago`);
          return;
        }

        const days = Math.floor(hours / 24);
        if (days === 1) {
          observer.next('1 day ago');
        } else if (days < 7) {
          observer.next(`${days} days ago`);
        } else {
          observer.next(this.getFullTime(value));
          observer.complete();
        }
      })
    });
  }

  private getFullTime(time: Date) {
    const day = time.getDay();
    const month = time.getMonth();
    const year = time.getFullYear();

    return `${this.MONTH_NAME[month]} ${day}, ${year}`
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
