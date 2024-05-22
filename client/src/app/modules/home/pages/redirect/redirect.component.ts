import { UrlsService } from 'src/app/core/services/urls.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, switchMap, tap, timer } from 'rxjs';
import { Url } from 'src/app/core/models/url.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'redirect-page',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectPage implements OnInit {
  isLoading = true;
  countdownTime = 5;
  url?: Url;

  constructor(
    private route: ActivatedRoute,
    private urlsService: UrlsService,
  ) {}

  ngOnInit() {
    const backHalf = this.route.snapshot.paramMap.get("backHalf");

    if (!backHalf) {
      this.isLoading = false;
    } else {
      this.urlsService.getUrlByBackHalf(backHalf).pipe(
        tap((data) => this.url = data),
        finalize(() => this.isLoading = false),
        filter((data) => !!data),
        switchMap(() => timer(0, 1000)),
        tap(() => {
          if (this.countdownTime <= 0) {
            window.location.href = this.url?.origin_url as string;
          } else {
            this.countdownTime -= 1;
          }
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }
}
