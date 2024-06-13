import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService
  ) {}

  @PublicRoute()
  @Get("public")
  getPublicAnalytics() {
    return this.analyticsService.getPublicAnalytics();
  }

  @Get()
  getAnalytics(@CurrentUser() currentUser: User) {
    return this.analyticsService.getAnalytics(currentUser);
  }
}
