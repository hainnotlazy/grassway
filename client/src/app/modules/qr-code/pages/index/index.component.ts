import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, finalize, map, Observable, scan, take, tap } from 'rxjs';
import { getValueInNumber } from 'src/app/core/helpers';
import { UrlsResponse, LinkActiveOptions } from 'src/app/core/interfaces';
import { ExtendedUrl, Url } from 'src/app/core/models';
import { UrlsService, UserSettingService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage {
  isLoading = false;
  currentPage = 1;
  totalPage = 1;

  userSetting$ = this.userSettingService.getUserSetting();

  private infiniteLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  infiniteLoad$: Observable<ExtendedUrl[]> = this.infiniteLoadSubject.asObservable().pipe(
    filter(response => !!response),
    map(response => response as UrlsResponse),
    tap((response: UrlsResponse) => {
      const responseMeta = response.meta;
      this.currentPage = getValueInNumber(responseMeta.currentPage);
      this.totalPage = getValueInNumber(responseMeta.totalPages);
    }),
    scan((accumulatorResponse: Url[], response: UrlsResponse) => {
      return [...accumulatorResponse, ...response.data];
    }, []),
    map(data => {
      return data.map(url => ({
        ...url,
        client: `${environment.client}/l/`
      }))
    })
  );

  constructor(
    private urlsService: UrlsService,
    private userSettingService: UserSettingService
  ) {
    this.urlsService.listUrls({
      page: 1,
      linkActiveOptions: LinkActiveOptions.ALL
    }).pipe(
      tap((response) => {
        this.infiniteLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onScrollDown() {
    if (this.currentPage < this.totalPage && !this.isLoading) {
      this.isLoading = true;
      this.urlsService.listUrls({
        page: this.currentPage + 1,
        linkActiveOptions: LinkActiveOptions.ALL
      }).pipe(
        tap((response) => {
          this.infiniteLoadSubject.next(response);
        }),
        finalize(() => this.isLoading = false),
        untilDestroyed(this)
      ).subscribe()
    }
  }
}
