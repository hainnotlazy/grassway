import { Module } from '@nestjs/common';
import { RedisService } from './services/redis/redis.service';

@Module({
  providers: [
    RedisService
  ],
  exports: [
    RedisService
  ]
})
export class SharedModule {}
