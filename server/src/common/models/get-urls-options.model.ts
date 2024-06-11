export enum LinkTypeOptions {
  ALL = "all",
  WITH_CUSTOM_BACK_HALVES = "with-custom-back-halves",
  WITHOUT_CUSTOM_BACK_HALVES = "without-custom-back-halves"
}

export enum LinkActiveOptions {
  ALL = "all",
  ACTIVE = "active",
  INACTIVE = "inactive"
}

export interface GetUrlsOptions {
  limit: number;
  page: number;
  linkActiveOptions?: LinkActiveOptions;
  linkTypeOptions?: LinkTypeOptions;
  startDate?: Date | string;
  endDate?: Date | string;
  search: string;
  tagId?: string;
}