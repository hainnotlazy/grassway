import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalLinksAnalyticsResponse, PublicLinksAnalyticsResponse } from '../interfaces/analytics-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getPublicLinksAnalytics() {
    return this.httpClient.get<PublicLinksAnalyticsResponse>("api/analytics/public");
  }

  getPersonalLinksAnalytics() {
    return this.httpClient.get<PersonalLinksAnalyticsResponse>("api/analytics");
  }
}
