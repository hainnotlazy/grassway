import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, map, scan, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
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

  private infiniteLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private infiniteLoad$ = this.infiniteLoadSubject.asObservable();

  myUrls$ = combineLatest([
    this.urlsService.listUrls(1),
    this.infiniteLoad$
  ]).pipe(
    tap(([initialResponse, infiniteResponse]) => {
      const response = infiniteResponse || initialResponse;
      this.currentPage = this.getValueInNumber(response.meta.currentPage);
      this.totalPage = this.getValueInNumber(response.meta.totalPages);
    }),
    tap(([_, infiniteResponse]) => {
      if (infiniteResponse) {
        this.isLoading = changeStatus(this.isLoading);
      }
    }),
    scan((accumulatorResponse: Url[], [initialResponse, infiniteResponse]) => {
      return infiniteResponse ? [...accumulatorResponse, ...infiniteResponse.data] : initialResponse.data;
    }, []),
    map(data => {
      return data.map(url => ({
        ...url,
        back_half: `${environment.client}/${url.back_half}`
      }))
    }),
  );

  constructor(
    private urlsService: UrlsService
  ) {}

  onScrollDown() {
    if (this.currentPage < this.totalPage && !this.isLoading) {
      this.isLoading = true;
      this.urlsService.listUrls(this.currentPage + 1).pipe(
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
