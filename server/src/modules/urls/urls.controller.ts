import { Body, Controller, Post } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService
  ) {}

  @PublicRoute()
  @Post()
  async shortenUrl(@Body() body: ShortenUrlDto) {
    return this.urlsService.shortenUrl(body);
  }
}
