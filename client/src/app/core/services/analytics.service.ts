import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LinksAnalyticsResponse, PublicLinksAnalyticsResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Describe: Get public links analytics
  */
  getPublicLinksAnalytics() {
    return this.httpClient.get<PublicLinksAnalyticsResponse>("api/analytics/public");
  }

  /**
   * Describe: Get personal links analytics
  */
  getPersonalLinksAnalytics() {
    return this.httpClient.get<LinksAnalyticsResponse>("api/analytics");
  }

  /**
   * Describe: Get brand links analytics
  */
  getBrandLinksAnalytics(brandId: string) {
    return this.httpClient.get<LinksAnalyticsResponse>(`api/analytics/brands/${brandId}`);
  }
}
