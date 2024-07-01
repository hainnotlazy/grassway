export interface UpdateUrlDto {
  id: number;
  title: string;
  description?: string;
  is_active?: boolean;
  custom_back_half?: string;
  change_password: boolean;
  password?: string;
  tags?: string[];
}
