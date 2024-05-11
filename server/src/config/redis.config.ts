import { RedisModuleOptions } from "@nestjs-modules/ioredis";

export const RedisConfigOptions: RedisModuleOptions = {
  type: "single",
  options: {
    host: "redis",
    port: 6379
  }
}