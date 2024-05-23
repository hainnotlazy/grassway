import { Body, Controller, DefaultValuePipe, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { CreateShortenUrlDto } from './dtos/create-shorten-url.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Url } from 'src/entities/url.entity';
import { LinkTypeValidationPipe } from 'src/shared/pipes/link-type-validation/link-type-validation.pipe';
import { LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import { AccessProtectedUrlDto } from './dtos/access-protected-url.dto';

@ApiTags("Urls")
@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService
  ) {}

  // Get paginated urls by user id
  @Get()
  getUrls(
    @CurrentUser() currentUser: User, 
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("is_active", new DefaultValuePipe(true), ParseBoolPipe) isActive: boolean,
    @Query("link_type", new DefaultValuePipe(LinkTypeOptions.ALL), LinkTypeValidationPipe) linkType: LinkTypeOptions,
    @Query("start_date") startDate: string,
    @Query("end_date") endDate: string
  ) {
    return this.urlsService.getUrls(currentUser, {
      limit: 10,
      page: page || 1,
      isActive: isActive,
      linkTypeOptions: linkType,
      startDate: startDate,
      endDate: endDate
    });
  }
  
  // Get url by back-half
  @Get("/:backHalf/information")
  async getUrlByBackHalf(@Param("backHalf") backHalf: string) {
    const url = await this.urlsService.getUrlByBackHalf(backHalf);
    if (url.password) {
      url.origin_url = null;
    }

    return url;
  }

  @Get("validate-custom-back-half")
  validateCustomBackHalf(@Query("back_half") backHalf: string) {
    return this.urlsService.validateCustomBackHalf(backHalf);
  }

  @PublicRoute()
  @Post()
  @ApiOperation({ summary: "Shorten url route for anonymous users" })
  @ApiCreatedResponse({
    description: "Shortened url successfully",
    type: Url
  })
  shortenUrl(@Body() body: ShortenUrlDto) {
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
  shortenUrlByUser(@CurrentUser() currentUser: User, @Body() body: CreateShortenUrlDto) {
    return this.urlsService.shortenUrl(currentUser, body);
  }

  @Post("/:id/access")
  accessProtectedUrl(@Param("id") id: string, @Body() body: AccessProtectedUrlDto) {
    return this.urlsService.accessProtectedUrl({
      id,
      password: body.password
    });
  }

  @Put()
  updateUrl(@Body() body: ShortenUrlDto) {
    
  }
}
