export enum LinkTypeOptions {
  ALL = "all",
  WITH_CUSTOM_BACK_HALVES = "with-custom-back-halves",
  WITHOUT_CUSTOM_BACK_HALVES = "without-custom-back-halves"
}

export interface GetUrlsOptions {
  limit: number;
  page: number;
  isActive?: boolean;
  linkTypeOptions?: LinkTypeOptions;
  startDate?: Date | string;
  endDate?: Date | string;
  search: string;
  tagId?: string;
}