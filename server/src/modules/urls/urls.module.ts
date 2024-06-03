import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from 'src/entities/url.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Url]),
    SharedModule
  ],
  controllers: [UrlsController],
  providers: [UrlsService]
})
export class UrlsModule {}
