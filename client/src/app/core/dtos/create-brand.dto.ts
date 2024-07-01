export interface CreateBrandDto {
  [key: string]: any;
  title: string;
  description?: string;
  prefix: string;
  logo?: any;
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  discord?: string;
  github?: string;
  website?: string;
  invited_users: number[];
}
