import { ConfigModuleOptions } from "@nestjs/config";

const NODE_ENV = process.env.NODE_ENV || "example";

export const ConfigOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: `.env.${NODE_ENV}`,
  cache: true
}