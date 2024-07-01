import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/core/services';

@Component({
  selector: 'app-overview-charts',
  templateUrl: './overview-charts.component.html',
  styleUrls: ['./overview-charts.component.scss'],
  host: {
    class: 'block'
  }
})
export class OverviewChartsComponent implements OnInit {
  overviewAnalytics$ = this.analyticsService.getPersonalLinksAnalytics();
  constructor(
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {

  }
}
