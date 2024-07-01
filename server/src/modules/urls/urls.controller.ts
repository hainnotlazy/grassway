import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post, Put, Query, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ShortenUrlDto, CreateShortenUrlDto, AccessProtectedUrlDto, UpdateShortenUrlDto, BulkChangeStatusUrlsDto, BulkSetTagUrlsDto, VisitUrlDto } from './dtos';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User, Url } from 'src/entities';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LinkTypeValidationPipe } from 'src/shared/pipes/link-type-validation/link-type-validation.pipe';
import { LinkActiveOptions, LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import * as fs from "fs";
import { CsvService } from 'src/shared/services/csv/csv.service';
import { LinkActiveValidationPipe } from 'src/shared/pipes/link-active-validation/link-active-validation.pipe';

@ApiTags("Urls")
@Controller('urls')
export class UrlsController {
  constructor(
    private urlsService: UrlsService,
    private csvService: CsvService
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
    @Query("is_active", new DefaultValuePipe(LinkActiveOptions.ACTIVE), LinkActiveValidationPipe) linkActive: LinkActiveOptions,
    @Query("link_type", new DefaultValuePipe(LinkTypeOptions.ALL), LinkTypeValidationPipe) linkType: LinkTypeOptions,
    @Query("start_date") startDate: string,
    @Query("end_date") endDate: string,
    @Query("search", new DefaultValuePipe("")) search: string,
    @Query("tag_id", new DefaultValuePipe("")) tagId: string,
  ) {
    return this.urlsService.getUrls(currentUser, {
      limit: 20,
      page: page || 1,
      linkActiveOptions: linkActive,
      linkTypeOptions: linkType,
      startDate,
      endDate,
      search,
      tagId
    });
  }

  @PublicRoute()
  @Get("/:backHalf/information")
  @ApiOperation({ summary: "Get url by back half" })
  @ApiOkResponse({
    description: "Get url by back half successfully",
    type: Url
  })
  @ApiNotFoundResponse({
    description: "Url not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async getUrlByBackHalf(@Param("backHalf") backHalf: string) {
    const url = await this.urlsService.getUrlByBackHalf(backHalf);
    if (url.password && !url.is_active) {
      url.origin_url = null;
    }

    return url;
  }

  @Get("validate-custom-back-half")
  @ApiOperation({ summary: "Validate custom back half if it exists" })
  @ApiBearerAuth()
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
  validateCustomBackHalf(@CurrentUser() currentUser: User, @Query("back_half") backHalf: string) {
    return this.urlsService.validateCustomBackHalf(backHalf);
  }

  @PublicRoute()
  @Post()
  @ApiOperation({ summary: "Shorten url route for anonymous users" })
  @ApiCreatedResponse({
    description: "Shortened url successfully",
    type: Url
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  shortenUrl(@Body() shortenUrlDto: ShortenUrlDto) {
    return this.urlsService.shortenUrl(null, shortenUrlDto);
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
  shortenUrlByUser(@CurrentUser() currentUser: User, @Body() createShortenUrlDto: CreateShortenUrlDto) {
    return this.urlsService.shortenUrl(currentUser, createShortenUrlDto);
  }

  @PublicRoute()
  @Post("/:id/access")
  @HttpCode(200)
  @ApiOperation({ summary: "Access protected url route (routes have password)" })
  @ApiOkResponse({
    description: "Access protected url successfully",
    type: Url
  })
  @ApiBadRequestResponse({
    description: "Password is incorrect",
  })
  @ApiNotFoundResponse({
    description: "Url not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  accessProtectedUrl(@Param("id", ParseIntPipe) id: number, @Body() accessProtectedUrlDto: AccessProtectedUrlDto) {
    return this.urlsService.accessProtectedUrl({
      id,
      password: accessProtectedUrlDto.password
    });
  }

  @Put("/:id")
  @ApiOperation({ summary: "Update url" })
  @ApiBearerAuth()
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
    @Param("id", ParseIntPipe) urlId: number,
    @Body() updateShortenUrlDto: UpdateShortenUrlDto
  ) {
    return this.urlsService.updateUrl(currentUser, urlId, updateShortenUrlDto);
  }

  @Delete("/:id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete url" })
  @ApiBearerAuth()
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
  @ApiResponse({
    status: 500,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "Internal server error": {
            value: "Internal server error"
          },
          "Failed when deleting url": {
            value: "Failed when deleting url"
          }
        }
      }
    }
  })
  async deleteUrl(@CurrentUser() currentUser: User, @Param("id", ParseIntPipe) id: number) {
    await this.urlsService.deleteUrl(currentUser, id);
    return;
  }

  @PublicRoute()
  @Put(":id/visit")
  @HttpCode(204)
  @ApiOperation({ summary: "Count times url is accessed" })
  @ApiNoContentResponse({
    description: "Count times url is accessed",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async visitUrl(@Param("id") id: string, @Body() visitUrlDto: VisitUrlDto) {
    await this.urlsService.visitUrl(id, visitUrlDto.deviceType, visitUrlDto.referrer_type);
    return;
  }

  @PublicRoute()
  @Put(":id/redirect-success")
  @HttpCode(204)
  
  @ApiOperation({ summary: "Count times url is redirected successfully" })
  @ApiNoContentResponse({
    description: "Count times url is redirected successfully",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async redirectSuccessUrl(@Param("id") id: string) {
    await this.urlsService.redirectSuccessUrl(id);
    return;
  }

  @PublicRoute()
  @Get(":id")
  @ApiOperation({
    summary: "Get url by id",
  })
  @ApiOkResponse({
    description: "Get url by id successfully",
    type: Url
  })
  @ApiNotFoundResponse({
    description: "Url not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getUrlById(
    @Param("id", ParseIntPipe) id: number,
    @Query("get_analytics", new DefaultValuePipe(false), ParseBoolPipe) getAnalytics: boolean
  ) {
    return this.urlsService.getUrlById(id, getAnalytics);
  }

  /** Routes for bulk actions */
  // -------------------------------------------------
  @Put("/bulk/update-status")
  @HttpCode(204)
  @ApiOperation({ summary: "Update status urls" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Update status urls successfully",
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
  @ApiResponse({
    status: 500,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "Internal server error": {
            value: "User not found"
          },
          "Failed when bulk action": {
            value: "Failed when bulk active/inactive urls"
          }
        }
      }
    }
  })
  setStatusUrls(
    @CurrentUser() currentUser: User, 
    @Body() bulkChangeStatusUrlsDto: BulkChangeStatusUrlsDto
  ) {
    return this.urlsService.setStatusUrls(currentUser, bulkChangeStatusUrlsDto.ids, bulkChangeStatusUrlsDto.active);
  }

  @Get("/bulk/export-csv")
  @ApiOperation({ summary: "Export urls as csv" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Download file csv",
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
  async exportCsv(
    @CurrentUser() currentUser: User,
    @Query("id", new DefaultValuePipe([]), ParseArrayPipe) query,
    @Res() res
  ) {
    const csvFilePath = await this.urlsService.exportCsv(currentUser, query);
    const fileName = csvFilePath.split("/").pop();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    const fileStream = fs.createReadStream(csvFilePath);

    fileStream.pipe(res);
    fileStream.on("end", () => {
      this.csvService.removeUnusedFile(csvFilePath);
    })
  }

  @Put("/bulk/set-tag")
  @ApiOperation({ summary: "Set tag for urls" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Set tag for urls successfully",
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
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Tag not found": {
            value: "Tag not found"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: "Internal server error",
    content: {
      "application/json": { 
        examples: {
          "Internal server error": {
            value: "Internal server error"
          },
          "Failed when bulk action": {
            value: "Failed when bulk set tag urls"
          }
        }
      }
    }
  })
  async setTagUrls(
    @CurrentUser() currentUser: User,
    @Body() bulkSetTagUrlsDto: BulkSetTagUrlsDto
  ) {
    return this.urlsService.setTagUrls(currentUser, bulkSetTagUrlsDto);
  }
}
