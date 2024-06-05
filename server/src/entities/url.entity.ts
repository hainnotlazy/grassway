import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { TaggedUrl } from "./tagged-url.entity";

@Entity()
export class Url {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.urls)
  @JoinColumn({ name: "owner_id" })
  @Exclude()
  owner: User;

  @OneToMany(() => TaggedUrl, taggedUrl => taggedUrl.url)
  tags: TaggedUrl[];

  @ApiProperty()
  @Column()
  origin_url: string;

  @ApiProperty()
  @Column({ unique: true })
  back_half: string;
  
  @ApiProperty()
  @Column({ nullable: true, unique: true })
  custom_back_half: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column({ default: false })
  use_password: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;
  
  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @BeforeInsert() 
  handleBeforeInsert() {
    // Hash Password
    // if (this.password) {
    //   this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
    //   this.use_password = true;
    // }

    // Generate title if not provided
    if (!this.title) {
      this.title = `Unnamed title ${Math.floor(Math.random() * 100000)}`;
    }
  }
}