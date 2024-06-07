import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from 'src/entities/url.entity';
import { SharedModule } from 'src/shared/shared.module';
import { TaggedUrl } from 'src/entities/tagged-url.entity';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url, TaggedUrl]),
    TagsModule,
    SharedModule
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService]
})
export class UrlsModule {}
