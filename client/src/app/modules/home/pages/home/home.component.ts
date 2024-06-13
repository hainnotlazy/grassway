import { Component } from '@angular/core';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    class: 'flex flex-col justify-center gap-8'
  }
})
export class HomePage {
  publicAnalytics$ = this.analyticsService.getPublicLinksAnalytics();

  constructor(
    private analyticsService: AnalyticsService
  ) {}
}
