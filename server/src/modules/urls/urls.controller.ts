import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto } from './dtos/shorten-url.dto';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { CreateShortenUrlDto } from './dtos/create-shorten-url.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Url } from 'src/entities/url.entity';
import { LinkTypeValidationPipe } from 'src/shared/pipes/link-type-validation/link-type-validation.pipe';
import { LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import { AccessProtectedUrlDto } from './dtos/access-protected-url.dto';
import { UpdateShortenUrlDto } from './dtos/update-shorten-url.dto';

@ApiTags("Urls")
@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService
  ) {}

  /** Get paginated urls by user id */ 
  @Get()
  @ApiOperation({
    summary: "Get paginated urls by user",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get paginated urls successfully",
    type: [Url]
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

  @PublicRoute()
  @Get("/:backHalf/information")
  @ApiOperation({ summary: "Get url by back half" })
  @ApiOkResponse({
    description: "Get url by back half successfully",
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
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Url not found": {
            value: "Url not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async getUrlByBackHalf(@Param("backHalf") backHalf: string) {
    const url = await this.urlsService.getUrlByBackHalf(backHalf);
    if (url.password) {
      url.origin_url = null;
    }

    return url;
  }

  @Get("validate-custom-back-half")
  @ApiOperation({ summary: "Validate custom back half if it exists" })
  @ApiOkResponse({
    description: "Validate custom back half if it exists successfully",
    type: Boolean
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

  @PublicRoute()
  @Post("/:id/access")
  @HttpCode(200)
  @ApiOperation({ summary: "Access protected url route (routes have password)" })
  @ApiOkResponse({
    description: "Access protected url successfully",
    type: Url
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Password is incorrect": {
            value: "Password is incorrect"
          }
        }
      }
    }
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
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Url not found": {
            value: "Url not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  accessProtectedUrl(@Param("id") id: string, @Body() body: AccessProtectedUrlDto) {
    return this.urlsService.accessProtectedUrl({
      id,
      password: body.password
    });
  }

  @Put("/:id")
  @ApiOperation({ summary: "Update url" })
  @ApiOkResponse({
    description: "Update url successfully",
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
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Url not found": {
            value: "Url not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateUrl(
    @CurrentUser() currentUser: User, 
    @Param("id") urlId: string,
    @Body() body: UpdateShortenUrlDto
  ) {
    return this.urlsService.updateUrl(currentUser, urlId, body);
  }

  @Delete("/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete url" })
  @ApiNoContentResponse({
    description: "Delete url successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "You don't have permission to delete this url": {
            value: "You don't have permission to delete this url"
          }
        }
      }
    }
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
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Url not found": {
            value: "Url not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async deleteUrl(@CurrentUser() currentUser: User, @Param("id") id: string) {
    await this.urlsService.deleteUrl(currentUser, id);
    return "";
  }
}
