import { Url } from "../models/url.model";

export interface UrlsResponse {
  data: Url[];
  meta: {
    itemsPerPage: number,
    totalItems: number,
    currentPage: number,
    totalPages: number
  },
  link: {
    current: string,
    next?: string;
    previous?: string,
    first?: string,
    last?: string
  }
}
