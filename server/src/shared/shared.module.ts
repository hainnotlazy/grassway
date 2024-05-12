import { Module } from '@nestjs/common';
import { RedisService } from './services/redis/redis.service';
import { HttpModule } from '@nestjs/axios';
import { DownloadFileService } from './services/download-file/download-file.service';

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    RedisService,
    DownloadFileService
  ],
  exports: [
    RedisService,
    DownloadFileService
  ]
})
export class SharedModule {}
