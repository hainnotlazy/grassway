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

export interface RemoveKeyRedisOptions {
  key: string;
  database?: RedisDatabase;
}

export enum RedisDatabase {
  JWT_BLACKLIST = 0,
  PUBLIC_ANALYTICS = 1,
  NOTIFICATION_SOCKET = 2
}

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis()
    private redisService: Redis
  ) {}

  /** 
   * Describe: Set key in redis
  */
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

  /** 
   * Describe: Get key in redis
  */
  async getKey(options: GetKeyRedisOptions): Promise<string> {
    const { 
      key, 
      database = RedisDatabase.JWT_BLACKLIST
    } = options;

    await this.selectDatabase(database);
    return this.redisService.get(key);
  }

  /** 
   * Describe: Remove key in redis
   */
  async removeKey(options: RemoveKeyRedisOptions) {
    const {
      key,
      database = RedisDatabase.JWT_BLACKLIST
    } = options;

    await this.selectDatabase(database);
    return await this.redisService.del(key);
  }

  /**  
   * Describe: Flush specific database in redis
  */
  async flushDatabase(database: RedisDatabase) {
    await this.selectDatabase(database);
    return await this.redisService.flushdb();
  }

  /** 
   * Describe: Select database in redis
  */
  private async selectDatabase(database: RedisDatabase) {
    return await this.redisService.select(database);
  }
}
