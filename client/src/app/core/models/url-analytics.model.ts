export interface UrlAnalytics {
  url_id: number;
  visited_by_desktop: number;
  visited_by_tablet: number;
  visited_by_mobile: number;
  redirect_success: number;
  referer_from_google: number;
  referer_from_facebook: number;
  referer_from_instagram: number;
  referer_from_youtube: number;
  referer_from_reddit: number;
  referer_from_twitter: number;
  referer_from_linkedin: number;
  updated_at?: Date;
}
