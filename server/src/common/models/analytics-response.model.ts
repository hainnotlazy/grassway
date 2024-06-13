export interface PersonalLinksAnalytics {
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

export interface PublicLinksAnalytics {
  totalLinks: number;
  totalVisited: number;
  totalCustomBackHalf: number;
}