import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService
  ) {}

  @Get()
  getAnalytics(@CurrentUser() currentUser: User) {
    return this.analyticsService.getAnalytics(currentUser);
  }

}
