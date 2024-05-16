import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';

@Pipe({
  name: 'countdown'
})
export class CountdownPipe implements PipeTransform, OnDestroy {
  private subscription?: Subscription;

  transform(value: Date): Observable<string> {
    if (typeof value !== "object") {
      value = new Date(value);
    }
    const endTime = value.getTime();

    return new Observable<string>(observer => {
      this.subscription = timer(0, 1000).subscribe(() => {
        const remainingTime = Math.max(0, endTime - new Date().getTime());
        if (remainingTime === 0) {
          observer.next('00:00:00');
          observer.complete();
        } else {
          const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
          observer.next(`${this.padWithZero(minutes)}:${this.padWithZero(seconds)}`);
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private padWithZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
