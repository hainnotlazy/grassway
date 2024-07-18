import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LinksAnalyticsResponse } from 'src/app/core/interfaces';
import { AnalyticsService } from 'src/app/core/services';

@Component({
  selector: 'app-overview-charts',
  templateUrl: './overview-charts.component.html',
  styleUrls: ['./overview-charts.component.scss'],
  host: {
    class: 'block dark:p-4 dark:rounded-md dark:bg-neutral-200 dark:shadow-md'
  }
})
export class OverviewChartsComponent implements OnInit {
  overviewAnalytics$: Observable<LinksAnalyticsResponse>;

  @Input() brandId?: string;

  constructor(
    private analyticsService: AnalyticsService
  ) {
    this.overviewAnalytics$ = this.analyticsService.getPersonalLinksAnalytics();
  }

  ngOnInit() {
    if (this.brandId) {
      this.overviewAnalytics$ = this.analyticsService.getBrandLinksAnalytics(this.brandId);
    }
  }
}
