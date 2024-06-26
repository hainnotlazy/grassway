import { Brand } from "./brand.model";
import { User } from "./user.model";

export enum BrandMemberRole {
  OWNER = "owner",
  MEMBER = "member"
}

export interface BrandMember {
  user_id: number;
  brand_id: string;
  user: User;
  brand: Brand;
  role: BrandMemberRole;
  created_at: Date;
  updated_at: Date;
}
