import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalLinksAnalyticsResponse, PublicLinksAnalyticsResponse } from '../interfaces';

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
    return this.httpClient.get<PersonalLinksAnalyticsResponse>("api/analytics");
  }
}
