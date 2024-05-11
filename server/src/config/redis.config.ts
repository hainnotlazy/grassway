import { RedisModuleOptions } from "@nestjs-modules/ioredis";

export const RedisConfigOptions: RedisModuleOptions = {
  type: "single",
  options: {
    host: "localhost",
    port: 6379
  }
}