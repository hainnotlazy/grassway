import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Url {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty()
  @Column()
  origin_url: string;

  @ApiProperty()
  @Column({ unique: true })
  back_half: string;
  
  @ApiProperty()
  @Column({ nullable: true })
  custom_back_half: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ default: true })
  is_active: boolean;
  
  @ApiProperty()
  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}