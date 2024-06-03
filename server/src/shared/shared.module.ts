import { Module } from '@nestjs/common';
import { RedisService } from './services/redis/redis.service';
import { HttpModule } from '@nestjs/axios';
import { DownloadFileService } from './services/download-file/download-file.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { CsvService } from './services/csv/csv.service';

@Module({
  imports: [
    HttpModule
  ],
  providers: [
    RedisService,
    DownloadFileService,
    UploadFileService,
    CsvService
  ],
  exports: [
    RedisService,
    DownloadFileService,
    UploadFileService,
    CsvService
  ]
})
export class SharedModule {}
