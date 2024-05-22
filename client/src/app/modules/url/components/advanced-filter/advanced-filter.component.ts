import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UrlsService } from 'src/app/core/services/urls.service';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { GetUrlsOptions, filtersApplied } from 'src/app/core/interfaces/get-urls-options.interface';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';

@UntilDestroy()
@Component({
  selector: 'app-advanced-filter',
  templateUrl: './advanced-filter.component.html',
  styleUrls: ['./advanced-filter.component.scss']
})
export class AdvancedFilterComponent {
  @Input() filterOptions!: GetUrlsOptions;

  @Input() initialLoadSubject!: BehaviorSubject<UrlsResponse | null>;
  @Input() infiniteLoadSubject!: BehaviorSubject<UrlsResponse | null>;

  @Output() filterChanged = new EventEmitter<GetUrlsOptions>();

  numberFilterApplied = 0;

  constructor(
    private urlsService: UrlsService,
    private dialog: MatDialog
  ) {}

  openFilterDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: "500px",
      data: this.filterOptions
    });

    dialogRef.afterClosed().pipe(
      filter(data => !!data && this.isFilterOptionsChanged(this.filterOptions, data)),
      tap((data: GetUrlsOptions) => {
        this.filterChanged.emit(data);
        this.numberFilterApplied = filtersApplied(this.filterOptions);
      }),
      switchMap(() => this.urlsService.listUrls({
        page: 1,
        ...this.filterOptions
      })),
      tap(response => {
        this.infiniteLoadSubject.next(null);
        this.initialLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe()
  }

  /** Compare props linkTypeOptions, startDate, endDate of 2 filter options */
  private isFilterOptionsChanged(baseOption: GetUrlsOptions, filterOptions: GetUrlsOptions) {
    if (
      baseOption.linkTypeOptions !== filterOptions.linkTypeOptions
      || baseOption.startDate !== filterOptions.startDate
      || baseOption.endDate !== filterOptions.endDate
    ) {
      return true;
    }
    return false;
  }
}
