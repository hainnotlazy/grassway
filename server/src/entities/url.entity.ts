import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Url {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, user => user.urls)
  @Exclude()
  owner: User;

  @ApiProperty()
  @Column()
  origin_url: string;

  @ApiProperty()
  @Column({ unique: true })
  back_half: string;
  
  @ApiProperty()
  @Column({ nullable: true })
  custom_back_half: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

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
    // Generate title if not provided
    if (!this.title) {
      this.title = `Unnamed title ${Math.floor(Math.random() * 100000)}`;
    }
  }
}