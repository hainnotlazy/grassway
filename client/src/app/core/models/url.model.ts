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
  created_at: Date;
  updated_at?: Date;
}
