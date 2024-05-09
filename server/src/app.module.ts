import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as config from './config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(config.ConfigOptions),
    TypeOrmModule.forRootAsync({
      useClass: config.TypeOrmConfigOptions
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
