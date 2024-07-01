import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag, TaggedUrl } from 'src/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, TaggedUrl]),
    SharedModule
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService]
})
export class TagsModule {}
