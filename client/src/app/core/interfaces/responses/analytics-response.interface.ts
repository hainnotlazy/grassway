export interface PersonalLinksAnalyticsResponse {
  totalVisited: number;
  totalRedirectedSuccess: number;
  totalClicksByDesktop: number;
  totalClicksByTablet: number;
  totalClicksByMobile: number;
  totalActiveLinks: number;
  totalInactiveLinks: number;
  totalReferrers: {
    google: number;
    facebook: number;
    instagram: number;
    youtube: number;
    reddit: number;
    twitter: number;
    linkedin: number;
    unknown: number;
  }
}

export interface PublicLinksAnalyticsResponse {
  totalLinks: number,
  totalCustomBackHalf: number,
  totalVisited: number
}
