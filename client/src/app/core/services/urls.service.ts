import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from '../models/url.model';
import { UrlsResponse } from '../interfaces/urls-response.interface';
import { ShortenUrl } from '../interfaces/shorten-url.interface';
import { Observable } from 'rxjs';
import { GetUrlsOptions, LinkTypeOptions } from '../interfaces/get-urls-options.interface';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  shortenUrl(url: ShortenUrl): Observable<Url>;
  shortenUrl(url: string): Observable<Url>;
  shortenUrl(url: ShortenUrl | string) {
    if (typeof url === "string") {
      return this.httpClient.post<Url>("api/urls", {
        origin_url: url
      })
    } else {
      return this.httpClient.post<Url>("api/urls/shorten-url", url)
    }
  }

  listUrls(options: GetUrlsOptions) {
    const {
      page = 1,
      isActive = true,
      linkTypeOptions = LinkTypeOptions.ALL
    } = options;

    return this.httpClient.get<UrlsResponse>(`api/urls?page=${page}&is_active=${isActive}&link_type=${linkTypeOptions}`);
  }
}
