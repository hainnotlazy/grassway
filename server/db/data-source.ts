import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { DataSource } from "typeorm";

/** 
 * Migration database for production
*/
config({
  path: `${__dirname}/../.env.production`
});

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get<string>("DB_HOST", "localhost"),
  username: configService.get<string>("DB_USERNAME", "postgres"),
  password: configService.get<string>("DB_PASSWORD", "postgres"),
  port: configService.get<number>("DB_PORT", 5432),
  database: configService.get<string>("DB_DATABASE", "grassway"),
  entities: [`${__dirname}/../src/**/*.entity{.ts,.js}`],
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});