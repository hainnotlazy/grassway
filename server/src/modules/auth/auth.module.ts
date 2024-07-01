import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy, GithubStrategy, JwtStrategy, GoogleStrategy, FacebookStrategy, TwitterStrategy } from './strategies';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigOptions } from 'src/config';
import { SharedModule } from 'src/shared/shared.module';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigOptions
    }),
    UsersModule,
    UrlsModule,
    SharedModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GithubStrategy,
    GoogleStrategy,
    FacebookStrategy,
    TwitterStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
