import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from '../models/url.model';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  shortenUrl(url: string) {
    return this.httpClient.post<Url>("api/urls", {
      origin_url: url
    })
  }
}
