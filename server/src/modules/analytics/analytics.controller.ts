import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    private analyticsService: AnalyticsService
  ) {}

  @PublicRoute()
  @Get("public")
  @ApiOperation({ summary: 'Get public analytics' })
  @ApiOkResponse({
    description: "Get public analytics data",
    schema: {
      example: {
        totalLinks: 0,
        totalCustomBackHalf: 0,
        totalVisited: 0
      }
    }
  })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  getPublicAnalytics() {
    return this.analyticsService.getPublicAnalytics();
  }

  @Get()
  @ApiOperation({ summary: 'Get personal analytics' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get personal analytics data",
    schema: {
      example: {
        totalLinks: 0,
        totalVisits: 0,
        totalActiveLinks: 0,
        totalInactiveLinks: 0,
        totalCustomBackHalfLinks: 0,
        totalDefaultBackHalfLinks: 0
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getAnalytics(@CurrentUser() currentUser: User) {
    return this.analyticsService.getAnalytics(currentUser);
  }
}
