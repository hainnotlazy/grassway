export interface UpdateUrl {
  id: string;
  title: string;
  description?: string;
  is_active?: boolean;
  custom_back_half?: string;
  change_password: boolean;
  password?: string;
}
