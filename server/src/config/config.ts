import { ConfigModuleOptions } from "@nestjs/config";

const NODE_ENV = process.env.NODE_ENV || "example";

export const ConfigOptions: ConfigModuleOptions = {
  isGlobal: true,
  cache: true,
  envFilePath: `.env.${NODE_ENV}`,
}