import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, filter, from, map, scan, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
import { environment } from 'src/environments/environment';
import { GetUrlsOptions, LinkTypeOptions } from 'src/app/core/interfaces/get-urls-options.interface';

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

  newFilterApplied = false;
  filterOptions: GetUrlsOptions = {
    isActive: true,
    linkTypeOptions: LinkTypeOptions.ALL
  };

  initialLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private initialLoad$ = this.initialLoadSubject.asObservable();

  infiniteLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private infiniteLoad$ = this.infiniteLoadSubject.asObservable();

  updateUrlSubject = new BehaviorSubject<Url | null>(null);
  private updateUrl$ = this.updateUrlSubject.asObservable();
  private lastUpdatedUrl?: Url;

  deleteUrlSubject = new BehaviorSubject<Url | null>(null);
  private deleteUrl$ = this.deleteUrlSubject.asObservable();
  private lastDeletedUrl?: Url;

  myUrls$ = combineLatest([
    this.initialLoad$,
    this.infiniteLoad$,
    this.updateUrl$,
    this.deleteUrl$
  ]).pipe(
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
    scan((accumulatorResponse: Url[], [initialResponse, infiniteResponse, updatedUrl, deletedUrl]) => {
      /** Find & update updated url */
      if (updatedUrl && this.compareTwoUrls(this.lastUpdatedUrl, updatedUrl)) {
        this.lastUpdatedUrl = updatedUrl;
        const updatedIndex = accumulatorResponse.findIndex(url => url.id === updatedUrl.id);
        accumulatorResponse[updatedIndex] = updatedUrl;
        return accumulatorResponse;
      }

      /** Find & remove deleted url */
      if (deletedUrl && this.lastDeletedUrl?.id !== deletedUrl.id) {
        this.lastDeletedUrl = deletedUrl;
        return accumulatorResponse.filter(url => url.id !== deletedUrl.id);
      }

      /** Combine initial response and infinite response */
      if (this.newFilterApplied) {
        this.newFilterApplied = false;
        return (initialResponse as UrlsResponse).data;
      } else {
        return infiniteResponse ? [...accumulatorResponse, ...infiniteResponse.data] : (initialResponse as UrlsResponse).data;
      }
    }, []),
    map(data => {
      return data.map(url => ({
        ...url,
        client: `${environment.client}/l/`
      }))
    }),
  );

  constructor(
    private urlsService: UrlsService,
  ) {}

  ngOnInit() {
    this.urlsService.listUrls({ page: 1 }).pipe(
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
        ...this.filterOptions
      }).pipe(
        tap((response) => {
          this.infiniteLoadSubject.next(response);
        }),
        untilDestroyed(this)
      ).subscribe()
    }
  }

  onStatusFilterChanged(status: boolean) {
    this.filterOptions.isActive = status;
    this.newFilterApplied = true;
  }

  onAdvancedFilterChanged(advancedFilter: GetUrlsOptions) {
    Object.assign(this.filterOptions, advancedFilter);
    this.newFilterApplied = true;
  }

  private getValueInNumber(value: string | number) {
    return typeof value === "string" ? parseInt(value) : value;
  }

  /** True if two urls are different, else false */
  private compareTwoUrls(fromUrl: Url | undefined, toUrl: Url | undefined) {
    if (
      !fromUrl
      || !toUrl
      || fromUrl.title !== toUrl.title
      || fromUrl.description !== toUrl.description
      || fromUrl.is_active !== toUrl.is_active
      || fromUrl.use_password !== toUrl.use_password
      || fromUrl.custom_back_half !== toUrl.custom_back_half
    ) {
      return true;
    }
    return false;
  }
}
