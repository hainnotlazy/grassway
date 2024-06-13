export interface PersonalLinksAnalyticsResponse {
  totalVisited: number;
  totalRedirectedSuccess: number;
  totalClicksByDesktop: number;
  totalClicksByTablet: number;
  totalClicksByMobile: number;
  totalActiveLinks: number;
  totalInactiveLinks: number;
  totalCustomBackHalf: number;
  totalDefaultBackHalf: number;
}

export interface PublicLinksAnalyticsResponse {
  totalLinks: number,
  totalCustomBackHalf: number,
  totalVisited: number
}
