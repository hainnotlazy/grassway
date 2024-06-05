import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Url } from "./url.entity";
import { Tag } from "./tag.entity";

@Entity()
export class TaggedUrl {
  @PrimaryColumn()
  url_id: string;

  @PrimaryColumn()
  tag_id: string;

  @ManyToOne(() => Url, url => url.tags)
  @JoinColumn({ name: "url_id" })
  url: Url;
  
  @ManyToOne(() => Tag, tag => tag.tagged_urls)
  @JoinColumn({ name: "tag_id" })
  tag: Tag;
}