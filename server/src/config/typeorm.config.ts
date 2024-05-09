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
      database: this.configService.get<string>("DB_DATABASE", "yuhat"),
      synchronize: process.env.NODE_ENV !== "production",
      entities: [__dirname + "/entities/*.ts"],
      autoLoadEntities: true
    }
  }
  
}