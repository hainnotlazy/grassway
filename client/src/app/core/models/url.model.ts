export interface Url {
  id: string;
  origin_url: string;
  back_half: string;
  custom_back_half: string;
  password?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}
