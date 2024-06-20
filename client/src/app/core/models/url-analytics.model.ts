export interface UrlAnalytics {
  url_id: number;
  visited_by_desktop: number;
  visited_by_tablet: number;
  visited_by_mobile: number;
  redirect_success: number;
  referrer_from_google: number;
  referrer_from_facebook: number;
  referrer_from_instagram: number;
  referrer_from_youtube: number;
  referrer_from_reddit: number;
  referrer_from_twitter: number;
  referrer_from_linkedin: number;
  referrer_from_unknown: number;
  updated_at?: Date;
}
