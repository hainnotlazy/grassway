import { Body, Controller, DefaultValuePipe, Get, ParseBoolPipe, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { CreateShortenUrlDto } from './dtos/create-shorten-url.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Url } from 'src/entities/url.entity';

@ApiTags("Urls")
@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService
  ) {}

  // Get paginated urls by user id
  @Get()
  async getUrls(
    @CurrentUser() currentUser: User, 
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("is_active", new DefaultValuePipe(true), ParseBoolPipe) isActive: boolean
  ) {
    return this.urlsService.getUrls(currentUser, {
      limit: 20,
      page: page || 1,
      isActive: isActive
    });
  }

  // Get url by back-half

  @PublicRoute()
  @Post()
  @ApiOperation({ summary: "Shorten url route for anonymous users" })
  @ApiCreatedResponse({
    description: "Shortened url successfully",
    type: Url
  })
  async shortenUrl(@Body() body: ShortenUrlDto) {
    return this.urlsService.shortenUrl(null, body);
  }

  @Post("shorten-url")
  @ApiOperation({ summary: "Shorten url route for authenticated users" })
  @ApiBearerAuth()
  @ApiCreatedResponse({ 
    description: "Shortened url successfully", 
    type: Url
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
  async shortenUrlByUser(@CurrentUser() currentUser: User, @Body() body: CreateShortenUrlDto) {
    return this.urlsService.shortenUrl(currentUser, body);
  }
}
