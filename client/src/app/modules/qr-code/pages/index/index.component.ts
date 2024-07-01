import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, filter, map, scan, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { LinkActiveOptions } from 'src/app/core/interfaces/get-urls-options.interface';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';
import { Url } from 'src/app/core/models';
import { UrlsService, UserSettingService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage implements OnInit {
  isLoading = false;
  currentPage = 1;
  totalPage = 1;

  userSetting$ = this.userSettingService.getUserSetting();

  private initialLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private initialLoad$ = this.initialLoadSubject.asObservable();

  private infiniteLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private infiniteLoad$ = this.infiniteLoadSubject.asObservable();

  links$ = combineLatest(
    this.initialLoad$,
    this.infiniteLoad$
  ).pipe(
    filter(([initialResponse]) => !!initialResponse),
    tap(([initialResponse, infiniteResponse]) => {
      const response = infiniteResponse || (initialResponse as UrlsResponse);
      this.currentPage = this.getValueInNumber(response.meta.currentPage);
      this.totalPage = this.getValueInNumber(response.meta.totalPages);
    }),
    tap(([_, infiniteResponse]) => {
      if (infiniteResponse) {
        this.isLoading = changeStatus(this.isLoading);
      }
    }),
    scan((accumulatorResponse: Url[], [initialResponse, infiniteResponse]) => {
      /** Combine initial response and infinite response */
      return infiniteResponse ? [...accumulatorResponse, ...infiniteResponse.data] : (initialResponse as UrlsResponse).data;
    }, []),
    map(data => {
      return data.map(url => ({
        ...url,
        client: `${environment.client}/l/`
      }))
    }),
    untilDestroyed(this)
  );

  constructor(
    private urlsService: UrlsService,
    private userSettingService: UserSettingService
  ) {}

  ngOnInit() {
    this.urlsService.listUrls({
      page: 1,
      linkActiveOptions: LinkActiveOptions.ALL
    }).pipe(
      tap((response) => {
        this.initialLoadSubject.next(response);
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
        untilDestroyed(this)
      ).subscribe()
    }
  }

  private getValueInNumber(value: string | number) {
    return typeof value === "string" ? parseInt(value) : value;
  }
}
