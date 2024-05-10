import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GithubStrategy } from './strategies/github.strategy';

@Module({
  imports: [
    UsersModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GithubStrategy
  ],
  exports: [
  ]
})
export class AuthModule {}
