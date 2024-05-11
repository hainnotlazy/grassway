import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './common/decorators';

@Controller()
export class AppController {

  @PublicRoute()
  @Get()
  checkStatus() {
    return "Server is running!";
  }
}
