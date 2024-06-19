import { UrlAnalytics } from "./url-analytics.model";

export interface Url {
  id: number;
  origin_url: string;
  back_half: string;
  custom_back_half: string;
  title: string;
  description?: string;
  password?: string;
  use_password: boolean;
  is_active: boolean;
  tags: {
    tag_id: number;
    url_id: number;
  }[];
  analytics: UrlAnalytics;
  created_at: Date;
  updated_at?: Date;
}
