import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

export interface SetKeyRedisOptions {
  key: string;
  value: string;
  database?: RedisDatabase;
  expiresIn?: number;
}

export interface GetKeyRedisOptions {
  key: string;
  database?: RedisDatabase;
}

export enum RedisDatabase {
  JWT_BLACKLIST = 0,
  PUBLIC_ANALYTICS = 1,
}

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis()
    private redisService: Redis
  ) {}

  async setKey(options: SetKeyRedisOptions): Promise<"OK"> {
    const { 
      key, 
      value, 
      database = RedisDatabase.JWT_BLACKLIST, 
      expiresIn 
    } = options;

    await this.selectDatabase(database);
    await this.redisService.set(key, value);
    if (expiresIn) {
      await this.redisService.expire(key, expiresIn);
    }

    return "OK";
  }

  async getKey(options: GetKeyRedisOptions): Promise<string> {
    const { 
      key, 
      database = RedisDatabase.JWT_BLACKLIST
    } = options;

    await this.selectDatabase(database);
    return this.redisService.get(key);
  }

  private async selectDatabase(database: RedisDatabase) {
    return await this.redisService.select(database);
  }
}
