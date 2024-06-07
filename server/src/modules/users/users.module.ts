import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UrlsModule,
    SharedModule,
  ],
  controllers: [
    UsersController
  ],
  providers: [
    UsersService
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
