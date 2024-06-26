import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./brand.entity";

@Entity()
export class BrandSocialPlatforms {
  @PrimaryColumn()
  brand_id: string;

  @OneToOne(() => Brand, brand => brand.social_platforms)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  website: string;

  @UpdateDateColumn()
  updated_at: Date;
}