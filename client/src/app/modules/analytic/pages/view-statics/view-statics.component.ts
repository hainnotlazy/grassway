import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { ExtendedUrl, Tag } from 'src/app/core/models';
import { UrlsService, TagsService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'view-statics-page',
  templateUrl: './view-statics.component.html',
  styleUrls: ['./view-statics.component.scss']
})
export class ViewStaticsPage implements OnInit {
  url?: ExtendedUrl;
  tags: Tag[] = [];

  constructor(
    private urlsService: UrlsService,
    private tagsService: TagsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const urlId = this.route.snapshot.paramMap.get("linkId");

    // Check if urlId is number
    if (urlId && isNaN(parseInt(urlId))) {
      this.router.navigate(["/"]);
    }

    if (urlId) {
      this.urlsService.getUrlById(parseInt(urlId), true).pipe(
        tap((data) => {
          this.url = {
            ...data,
            client: environment.client
          };
        }),
        untilDestroyed(this)
      ).subscribe();

      this.tagsService.getTags().pipe(
        tap(tags => this.tags = tags),
        untilDestroyed(this)
      ).subscribe();
    }
  }
}
