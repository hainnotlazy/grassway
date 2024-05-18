import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService
  ) {}

  // Get paginated urls by user id
  @Get()
  async getUrls(@CurrentUser() currentUser: User, @Query("page") page: number) {
    return this.urlsService.getUrls(currentUser, 10, page);
  }

  // Get url by back-half

  @PublicRoute()
  @Post()
  async shortenUrl(@Body() body: ShortenUrlDto) {
    return this.urlsService.shortenUrl(null, body);
  }

  @Post("shorten-url")
  async shortenUrlByUser(@CurrentUser() currentUser: User, @Body() body: ShortenUrlDto) {
    return this.urlsService.shortenUrl(currentUser, body);
  }
}
