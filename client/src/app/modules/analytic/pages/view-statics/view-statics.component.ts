import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { UrlsService } from 'src/app/core/services/urls.service';
import { ExtendedUrl } from 'src/app/modules/url/components/link/link.component';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'view-statics-page',
  templateUrl: './view-statics.component.html',
  styleUrls: ['./view-statics.component.scss']
})
export class ViewStaticsPage implements OnInit {
  url?: ExtendedUrl;

  constructor(
    private urlsService: UrlsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const urlId = this.route.snapshot.paramMap.get("linkId");

    if (urlId) {
      this.urlsService.getUrlById(urlId).pipe(
        tap((data) => {
          this.url = {
            ...data,
            client: environment.client
          };
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }
}
