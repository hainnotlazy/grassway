import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, filter, map, scan, switchMap, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
import { environment } from 'src/environments/environment';
import { FilterDialogComponent } from '../../components/filter-dialog/filter-dialog.component';
import { GetUrlsOptions, LinkTypeOptions, filtersApplied } from 'src/app/core/interfaces/get-urls-options.interface';

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
  numberFilterApplied = 0;

  private initialLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private initialLoad$ = this.initialLoadSubject.asObservable();

  private infiniteLoadSubject = new BehaviorSubject<UrlsResponse | null>(null);
  private infiniteLoad$ = this.infiniteLoadSubject.asObservable();

  myUrls$ = combineLatest([
    this.initialLoad$,
    this.infiniteLoad$
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
    scan((accumulatorResponse: Url[], [initialResponse, infiniteResponse]) => {
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
    private dialog: MatDialog
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

  onFilterChange(data: MatSelectChange) {
    const value = data.value;
    this.filterOptions.isActive = value === "active";

    this.urlsService.listUrls({
      page: 1,
      ...this.filterOptions
    }).pipe(
      tap((response) => {
        this.newFilterApplied = true;
        this.infiniteLoadSubject.next(null);
        this.initialLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  openFilterDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: "500px",
      data: this.filterOptions
    });

    dialogRef.afterClosed().pipe(
      filter(data => !!data && this.isFilterOptionsChanged(this.filterOptions, data)),
      tap((data: GetUrlsOptions) => {
        Object.assign(this.filterOptions, data);
        this.numberFilterApplied = filtersApplied(this.filterOptions);
      }),
      switchMap(() => this.urlsService.listUrls({
        page: 1,
        ...this.filterOptions
      })),
      tap(response => {
        this.newFilterApplied = true;
        this.infiniteLoadSubject.next(null);
        this.initialLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe()
  }

  /** Compare props linkTypeOptions, startDate, endDate of 2 filter options */
  private isFilterOptionsChanged(baseOption: GetUrlsOptions, filterOptions: GetUrlsOptions) {
    if (baseOption.linkTypeOptions !== filterOptions.linkTypeOptions) {
      return true;
    } else if (baseOption.startDate !== filterOptions.startDate) {
      return true;
    } else if (baseOption.endDate !== filterOptions.endDate) {
      return true;
    }
    return false;
  }

  private getValueInNumber(value: string | number) {
    return typeof value === "string" ? parseInt(value) : value;
  }
}
