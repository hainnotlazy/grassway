import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from '../models/url.model';
import { UrlsResponse } from '../interfaces/urls-response.interface';
import { ShortenUrl } from '../interfaces/shorten-url.interface';
import { Observable } from 'rxjs';
import { GetUrlsOptions, LinkTypeOptions } from '../interfaces/get-urls-options.interface';
import { UpdateUrl } from '../interfaces/urls.interface';

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

  getUrlByBackHalf(backHalf: string) {
    return this.httpClient.get<Url>(`api/urls/${backHalf}/information`);
  }

  listUrls(options: GetUrlsOptions) {
    const {
      page = 1,
      isActive = true,
      linkTypeOptions = LinkTypeOptions.ALL,
      startDate = "",
      endDate = ""
    } = options;

    return this.httpClient.get<UrlsResponse>(`api/urls?page=${page}&is_active=${isActive}&link_type=${linkTypeOptions}&start_date=${startDate}&end_date=${endDate}`);
  }

  accessProtectedUrl(id: string, password: string) {
    return this.httpClient.post<Url>(`api/urls/${id}/access`, {
      password
    })
  }

  validateCustomBackHalf(customBackHalf: string) {
    return this.httpClient.get<boolean>(`api/urls/validate-custom-back-half?back_half=${customBackHalf}`);
  }

  updateUrl(updateUrl: UpdateUrl) {
    return this.httpClient.put<Url>(`api/urls/${updateUrl.id}`, updateUrl)
  }

  deleteUrl(id: string) {
    return this.httpClient.delete(`api/urls/${id}`)
  }
}
