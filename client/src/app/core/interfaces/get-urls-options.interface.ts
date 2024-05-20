enum BackHalfOptions {
  ALL = "all",
  ONLY_BACK_HALF = "onlyBackHalf",
  ONLY_CUSTOM_BACK_HALF = "onlyCustomBackHalf"
}

export interface GetUrlsOptions {
  page: number;
  isActive?: boolean;
  backHalfOptions?: BackHalfOptions;
  startDate?: Date;
  endDate?: Date;
}
