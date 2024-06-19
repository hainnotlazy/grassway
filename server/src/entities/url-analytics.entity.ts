import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Url } from "./url.entity";

@Entity()
export class UrlAnalytics {
  @PrimaryColumn()
  url_id: number;

  @OneToOne(() => Url, url => url.analytics)
  @JoinColumn({ name: "url_id" })
  @Exclude()
  url: Url;

  @ApiProperty()
  @Column({ default: 0 })
  visited_by_desktop: number;

  @ApiProperty()
  @Column({ default: 0 })
  visited_by_tablet: number;

  @ApiProperty()
  @Column({ default: 0 })
  visited_by_mobile: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  redirect_success: number;

  @ApiProperty()
  @Column({ default: 0 })
  referer_from_google: number;

  @ApiProperty()
  @Column({ default: 0 })
  referer_from_facebook: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  referer_from_instagram: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  referer_from_youtube: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  referer_from_reddit: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  referer_from_twitter: number;
  
  @ApiProperty()
  @Column({ default: 0 })
  referer_from_linkedin: number;
  
  @ApiProperty()
  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}