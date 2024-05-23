import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, tap } from 'rxjs';
import { GetUrlsOptions } from 'src/app/core/interfaces/get-urls-options.interface';
import { UrlsResponse } from 'src/app/core/interfaces/urls-response.interface';
import { UrlsService } from 'src/app/core/services/urls.service';

@UntilDestroy()
@Component({
  selector: 'app-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss']
})
export class StatusFilterComponent {
  @Input() filterOptions!: GetUrlsOptions;
  @Input() initialLoadSubject!: BehaviorSubject<UrlsResponse | null>;
  @Input() infiniteLoadSubject!: BehaviorSubject<UrlsResponse | null>;

  @Output() filterChanged =  new EventEmitter<boolean>();

  constructor(
    private urlsService: UrlsService
  ) {}

  onFilterChange(data: MatSelectChange) {
    const value = data.value;
    const status = value === "active";
    this.filterOptions.isActive = status;

    /** Fetch data with new filter & push to observable stream */
    this.urlsService.listUrls({
      page: 1,
      ...this.filterOptions
    }).pipe(
      tap(() => {
        // Emit selected status
        this.filterChanged.emit(status);
      }),
      tap((response) => {
        // Push new data to stream
        this.infiniteLoadSubject.next(null);
        this.initialLoadSubject.next(response);
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
