export enum LinkTypeOptions {
  ALL = "all",
  WITH_CUSTOM_BACK_HALVES = "with-custom-back-halves",
  WITHOUT_CUSTOM_BACK_HALVES = "without-custom-back-halves"
}

export interface GetUrlsOptions {
  page?: number;
  isActive?: boolean;
  linkTypeOptions?: LinkTypeOptions;
  startDate?: Date | string;
  endDate?: Date | string;
  search?: string;
  tagId?: string;
}

const BaseFilterOptions: GetUrlsOptions = {
  page: 1,
  isActive: true,
  linkTypeOptions: LinkTypeOptions.ALL,
  startDate: "",
  endDate: ""
}

export function filtersApplied(options: GetUrlsOptions) {
  let count = 0;

  if (options.linkTypeOptions !== BaseFilterOptions.linkTypeOptions) {
    count ++;
  }

  if (options.startDate || options.endDate) {
    count ++;
  }

  if (options.tagId) {
    count ++;
  }

  return count;
}
