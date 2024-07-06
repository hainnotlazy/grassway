import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Brand } from "./brand.entity";

export enum BrandMemberRole {
  OWNER = "owner",
  MEMBER = "member"
}

@Entity()
export class BrandMember {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn("uuid")
  brand_id: string;

  @ManyToOne(() => User, user => user.brands)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Brand, brand => brand.members)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column({
    type: "enum",
    default: BrandMemberRole.MEMBER,
    enum: BrandMemberRole
  })
  role: BrandMemberRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}