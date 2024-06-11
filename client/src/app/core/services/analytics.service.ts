import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PersonalLinksAnalyticsResponse } from '../interfaces/analytics-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getPersonalLinksAnalytics() {
    return this.httpClient.get<PersonalLinksAnalyticsResponse>("api/analytics");
  }
}
