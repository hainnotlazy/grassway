import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as config from './config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { UrlsModule } from './modules/urls/urls.module';
import { TagsModule } from './modules/tags/tags.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HealthModule } from './modules/health/health.module';
import { NotificationModule } from './modules/notification/notification.module';
import { BrandsModule } from './modules/brands/brands.module';

const appModules = [
  HealthModule,
  UsersModule,
  AuthModule,
  UrlsModule,
  TagsModule,
  AnalyticsModule,
  SettingsModule,
]

@Module({
  imports: [
    ConfigModule.forRoot(config.ConfigOptions),
    TypeOrmModule.forRootAsync({
      useClass: config.TypeOrmConfigOptions
    }),
    RedisModule.forRoot(config.RedisConfigOptions),
    ServeStaticModule.forRoot(config.ServeStaticConfigOptions),
    MailerModule.forRootAsync({
      useClass: config.MailerConfigOptions
    }),
    ...appModules,
    NotificationModule,
    BrandsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ],
})
export class AppModule {}
