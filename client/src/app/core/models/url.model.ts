export interface Url {
  id: string;
  origin_url: string;
  back_half: string;
  custom_back_half: string;
  title: string;
  description?: string;
  password?: string;
  use_password: boolean;
  is_active: boolean;
  redirect_success: number;
  visited_by_desktop: number;
  visited_by_tablet: number;
  visited_by_mobile: number;
  tags: {
    tag_id: number;
    url_id: number;
  }[];
  created_at: Date;
  updated_at?: Date;
}
