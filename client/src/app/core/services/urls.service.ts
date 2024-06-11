import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Url } from '../models/url.model';
import { UrlsResponse } from '../interfaces/urls-response.interface';
import { ShortenUrl } from '../interfaces/shorten-url.interface';
import { Observable } from 'rxjs';
import { GetUrlsOptions, LinkActiveOptions, LinkTypeOptions } from '../interfaces/get-urls-options.interface';
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

  getUrlById(id: number) {
    return this.httpClient.get<Url>(`api/urls/${id}`);
  }

  listUrls(options: GetUrlsOptions) {
    const {
      page = 1,
      linkActiveOptions = LinkActiveOptions.ACTIVE,
      linkTypeOptions = LinkTypeOptions.ALL,
      startDate = "",
      endDate = "",
      search = "",
      tagId = "",
    } = options;

    return this.httpClient.get<UrlsResponse>(`api/urls?page=${page}&is_active=${linkActiveOptions}&link_type=${linkTypeOptions}&start_date=${startDate}&end_date=${endDate}&search=${search}&tag_id=${tagId}`);
  }

  accessProtectedUrl(id: number, password: string) {
    return this.httpClient.post<Url>(`api/urls/${id}/access`, {
      password
    })
  }

  validateCustomBackHalf(customBackHalf: string) {
    return this.httpClient.get<boolean>(`api/urls/validate-custom-back-half?back_half=${customBackHalf}`);
  }

  updateUrl(updateUrlDto: UpdateUrl) {
    return this.httpClient.put<Url>(`api/urls/${updateUrlDto.id}`, updateUrlDto);
  }

  deleteUrl(id: number) {
    return this.httpClient.delete(`api/urls/${id}`)
  }

  visitUrl(urlId: number, deviceType: "desktop" | "mobile" | "tablet") {
    return this.httpClient.put(`api/urls/${urlId}/visit`, {
      deviceType
    });
  }

  redirectSuccess(urlId: number) {
    return this.httpClient.put(`api/urls/${urlId}/redirect-success`, null);
  }

  // Bulk actions
  setStatusUrls(urls: Url[], active: boolean) {
    return this.httpClient.put(`api/urls/bulk/update-status`, {
      ids: urls.map(url => url.id),
      active
    })
  }

  exportCsv(urls: Url[]) {
    const urlQuery = urls.map(url => `id=${url.id}`).join('&');
    return this.httpClient.get(`api/urls/bulk/export-csv?${urlQuery}`, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  setTagUrls(urls: Url[], tagId: string, addTag: boolean = true) {
    return this.httpClient.put<Url[]>(`api/urls/bulk/set-tag`, {
      ids: urls.map(url => url.id),
      tag_id: tagId,
      add_tag: addTag
    })
  }
}
