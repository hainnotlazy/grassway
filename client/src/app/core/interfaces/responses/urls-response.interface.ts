import { Url } from "../../models";

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
