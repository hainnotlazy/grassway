import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmConfigOptions implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.configService.get<string>("DB_HOST", "localhost"),
      username: this.configService.get<string>("DB_USERNAME", "postgres"),
      password: this.configService.get<string>("DB_PASSWORD", "postgres"),
      port: this.configService.get<number>("DB_PORT", 5432),
      database: this.configService.get<string>("DB_DATABASE", "grassway"),
      synchronize: process.env.NODE_ENV === "development",
      logging: process.env.NODE_ENV === "development",
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      autoLoadEntities: true,
      migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
    }
  }
}