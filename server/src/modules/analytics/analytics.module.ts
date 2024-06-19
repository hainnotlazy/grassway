import { Url } from 'src/entities/url.entity';
import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { UrlAnalytics } from 'src/entities/url-analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Url, 
      UrlAnalytics
    ]),
    SharedModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
