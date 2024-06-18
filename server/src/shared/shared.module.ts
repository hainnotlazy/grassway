import { Module } from '@nestjs/common';
import { RedisService } from './services/redis/redis.service';
import { HttpModule } from '@nestjs/axios';
import { DownloadFileService } from './services/download-file/download-file.service';
import { UploadFileService } from './services/upload-file/upload-file.service';
import { CsvService } from './services/csv/csv.service';
import { TerminusModule } from '@nestjs/terminus';

const Services = [
  RedisService,
  DownloadFileService,
  UploadFileService,
  CsvService
]

@Module({
  imports: [
    HttpModule,
    TerminusModule
  ],
  providers: [
    ...Services
  ],
  exports: [
    ...Services,
    HttpModule,
    TerminusModule
  ]
})
export class SharedModule {}
