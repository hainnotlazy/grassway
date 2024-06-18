import { Controller, Get } from '@nestjs/common';
import { PublicRoute } from './common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags("Health Check")
@Controller()
export class AppController {

  @PublicRoute()
  @Get("health-check")
  @ApiOperation({
    summary: "Check server status"
  })
  checkStatus() {
    return "Server is running!";
  }
}
