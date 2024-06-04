import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
    SharedModule
  ],
  controllers: [TagsController],
  providers: [TagsService]
})
export class TagsModule {}
