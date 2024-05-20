enum BackHalfOptions {
  ALL = "all",
  ONLY_BACK_HALF = "onlyBackHalf",
  ONLY_CUSTOM_BACK_HALF = "onlyCustomBackHalf"
}

export interface GetUrlsOptions {
  limit: number;
  page: number;
  isActive?: boolean;
  backHalfOptions?: BackHalfOptions;
  startDate?: Date;
  endDate?: Date;
}