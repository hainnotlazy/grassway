import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto, BrandBlockDto, UpdateBlockOrderDto, CreateLinkDto, UpdateQrCodeDto, HandleInvitationDto } from './dtos';
import { BrandsService } from './brands.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { Brand, BrandBlockDraft, BrandDraft, BrandMember, BrandSocialPlatformsDraft, Url, User } from 'src/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandDraftService } from './brand-draft.service';
import { LinkActiveOptions, LinkTypeOptions } from 'src/common/models';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { UpdateShortenUrlDto } from '../urls/dtos';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(
    private brandsService: BrandsService,
    private brandDraftService: BrandDraftService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get brands by current user",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brands",
    type: [Brand]
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
  getBrands(@CurrentUser() currentUser: User) {
    return this.brandsService.getBrands(currentUser);
  }

  @Get("/validate-prefix")
  @ApiOperation({
    summary: "Validate brand prefix",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Validate brand prefix",
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
  async validateBrandPrefix(@Query("prefix", new DefaultValuePipe("")) prefix: string) {
    return !(await this.brandsService.validateBrandPrefix(prefix));
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Get brand by id",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brand",
    type: Brand
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "Brand not found or you are not a member of this brand": {
            value: "Brand not found or you are not a member of this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getBrand(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getBrandById(currentUser, id);
  }

  @PublicRoute()
  @Get("/prefix/:prefix")
  @ApiOperation({
    summary: "Get brand by brand prefix",
  })
  @ApiOkResponse({
    description: "Get brand",
    type: Brand
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
          "Brand did not exist!": {
            value: "Brand did not exist!"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getBrandByPrefix(@Param("prefix") prefix: string) {
    return this.brandsService.getBrandByPrefix(prefix);
  }

  @Get("/:id/members")
  @ApiOperation({
    summary: "Get brand members",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brand members",
    type: BrandMember
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getMembers(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getMembers(currentUser, id);
  }

  @Get("/:id/role")
  @ApiOperation({
    summary: "Get user role in brand",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get user role in brand",
    type: BrandMember
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getRole(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getRole(currentUser, id);
  }

  @Get("/:id/urls")
  @ApiOperation({
    summary: "Get paginated urls by brand",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get paginated urls successfully",
    type: [Url]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "Brand not found or you are not a member of this brand": {
            value: "Brand not found or you are not a member of this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getLinks(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("search", new DefaultValuePipe("")) search: string,
  ) {
    return this.brandsService.getLinks(currentUser, id, {
      limit: 20,
      page: page || 1,
      linkActiveOptions: LinkActiveOptions.ALL,
      linkTypeOptions: LinkTypeOptions.ALL,
      search,
    });
  }

  @Get("/:id/urls/filter")
  @ApiOperation({
    summary: "Get filtered urls in brand",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get filtered urls successfully",
    type: [Url]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getFilteredLinks(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Query("query", new DefaultValuePipe("")) query: string,
  ) {
    return this.brandsService.getFilteredLinks(currentUser, id, query);
  }

  @Get("/:id/urls/:linkId")
  @ApiOperation({
    summary: "Get url in brand by url id",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brand url successfully",
    type: Url
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to view this brand": {
            value: "You don't have permission to view this brand"
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
          "Link not found": {
            value: "Link not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getLinkById(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("linkId", ParseIntPipe) linkId: number
  ) {
    return this.brandsService.getLinkById(currentUser, brandId, linkId);
  }

  @Post()
  @UseInterceptors(FileInterceptor("logo"))
  @ApiOperation({
    summary: "Create new brand",
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Create new brand successfully",
    type: Brand
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Brand prefix already existed": {
            value: "Brand prefix already existed"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to create brand",
  })
  createBrand(
    @CurrentUser() currentUser: User,
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.brandsService.createBrand(currentUser, createBrandDto, logo);
  }

  @Post("/:id/members/send-invitation")
  @ApiOperation({
    summary: "Send invitation(s)",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Send invitation(s) successfully",
    type: [BrandMember]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to send invitation": {
            value: "You don't have permission to send invitation"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to send invitations",
  })
  sendInvitation(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() sendInvitationDto: SendInvitationDto
  ) {
    return this.brandsService.sendInvitation(currentUser, id, sendInvitationDto.ids);
  }


  @Post("/:id/urls")
  @ApiOperation({
    summary: "Create brand url",
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Create brand url successfully",
    type: Url
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  createLink(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createLinkDto: CreateLinkDto
  ) {
    return this.brandsService.createLink(currentUser, id, createLinkDto);
  }

  @Put("/:id/publish-changes")
  @HttpCode(204)
  @ApiOperation({
    summary: "Publish brand changes",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Publish brand changes successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to publish changes",
  })
  async publishChanges(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    await this.brandsService.publishChanges(currentUser, id);
    return;
  }

  @Put("/:id/discard-changes")
  @HttpCode(204)
  @ApiOperation({
    summary: "Discard brand changes",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Discard brand changes successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to discard changes",
  })
  async discardChanges(@CurrentUser() currentUser: User, @Param("id") id: string) {
    await this.brandDraftService.discardChanges(currentUser, id);
    return;
  }

  @Put("/:id/members/handle-invitation")
  @ApiOperation({
    summary: "Handle accept or reject invitation",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Handle accept or reject invitation successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "Brand not found or you don't have invitation for this brand": {
            value: "Brand not found or you don't have invitation for this brand"
          },
          "You already joined this brand": {
            value: "You already joined this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async handleInvitation(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() handleInvitationDto: HandleInvitationDto
  ) {
    const accepted = handleInvitationDto.response;
    const member = await this.brandsService.handleInvitation(currentUser, id, accepted);

    return accepted ? member : ""; 
  }

  @Put("/:id/qr-code")
  @ApiOperation({
    summary: "Update QR Code settings",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update QR Code settings successfully",
    type: Brand
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateQrCodeSettings(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateQrCodeDto: UpdateQrCodeDto
  ) {
    return this.brandsService.updateQrCodeSettings(currentUser, id, updateQrCodeDto);
  }

  @Put("/:id/urls/:urlId")
  @ApiOperation({
    summary: "Update brand url",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update brand url successfully",
    type: Url
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateLink(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Param("urlId", ParseIntPipe) urlId: number,
    @Body() updateShortenUrlDto: UpdateShortenUrlDto
  ) {
    return this.brandsService.updateLink(currentUser, id, urlId, updateShortenUrlDto);
  }

  @Put("/:id/members/:memberId/transfer-ownership") 
  @HttpCode(204)
  @ApiOperation({
    summary: "Transfer brand ownership",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Transfer brand ownership successfully",
    type: Brand
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You can't transfer ownership to yourself": {
            value: "You can't transfer ownership to yourself"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to transfer ownership",
  })
  async transferOwnership(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("memberId", ParseIntPipe) memberId: number
  ) {
    await this.brandsService.transferOwnership(currentUser, brandId, memberId);
    return;
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete brand",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Delete brand successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You are not owner of this brand to do this action": {
            value: "You are not owner of this brand to do this action"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to delete brand",
  })
  async deleteBrand(@CurrentUser() currentUser: User, @Param("id") id: string) {
    await this.brandsService.deleteBrand(currentUser, id);
    return;
  }

  @Delete("/:id/urls/:urlId")
  @ApiOperation({
    summary: "Delete brand url",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Delete brand url successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
          },
          "You can't delete this link because it's being used in blocks": {
            value: "You can't delete this link because it's being used in blocks"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to delete brand link",
  })
  async deleteLink(
    @CurrentUser() currentUser: User, 
    @Param("id") brandId: string, 
    @Param("urlId", ParseIntPipe) urlId: number) {
    await this.brandsService.removeUrl(currentUser, brandId, urlId);
    return;
  } 

  @Delete("/:id/members/leave")
  @ApiOperation({
    summary: "Leave brand",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Leave brand successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You are not owner of this brand to do this action": {
            value: "You are not owner of this brand to do this action"
          },
          "You can't leave this brand because you are owner": {
            value: "You can't leave this brand because you are owner"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async leaveBrand(@CurrentUser() currentUser: User, @Param("id") brandId: string) {
    return this.brandsService.leaveBrand(currentUser, brandId);
  }

  @Delete("/:id/members/:memberId")
  @ApiOperation({
    summary: "Remove member from brand",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Remove member from brand successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You can't remove yourself": {
            value: "You can't remove yourself"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async removeMember(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("memberId", ParseIntPipe) memberId: number
  ) {
    await this.brandsService.removeMember(currentUser, brandId, memberId);
    return;
  }

  /** Routes to interact with brand draft */
  // -------------------------------------

  @Get("/draft/prefix/:prefix")
  @ApiOperation({
    summary: "Get brand draft by prefix",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Get brand draft by prefix successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Brand not found or you are not a member of this brand": {
            value: "Brand not found or you are not a member of this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getBrandDraftByPrefix(
    @CurrentUser() currentUser: User,
    @Param("prefix") prefix: string
  ) {
    return this.brandDraftService.getBrandByPrefix(currentUser, prefix);
  }

  @Get("/draft/:id/design")
  @ApiOperation({
    summary: "Get brand draft design",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brand draft design successfully",
    type: [BrandDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "Brand not found or you are not a member of this brand": {
            value: "Brand not found or you are not a member of this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getBrandDesignDraft(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    return this.brandDraftService.getDesign(currentUser, id);
  }

  @Put("/draft/:id/design")
  @UseInterceptors(FileInterceptor("logo"))
  @ApiOperation({
    summary: "Update brand design",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update brand design successfully",
    type: [BrandDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Failed to update brand design draft!",
  })
  updateBrandDesignDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateBrandDesignDto: UpdateBrandDesignDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.brandDraftService.updateDesign(
      currentUser, 
      id, 
      updateBrandDesignDto, 
      logo
    );
  }

  @Put("/draft/:id/social-platforms") 
  @ApiOperation({
    summary: "Update brand draft social platforms",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update brand draft social platforms successfully",
    type: [BrandSocialPlatformsDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateBrandSocialPlatformsDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    return this.brandDraftService.updateSocialPlatform(
      currentUser, 
      id, 
      updateSocialPlatformsDto
    );
  }

  @Put("/draft/:id/social-platforms/order") 
  @ApiOperation({
    summary: "Update brand draft social platforms order",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update brand draft social platforms order successfully",
    type: [BrandSocialPlatformsDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateBrandSocialPlatformsDraftOrder(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    return this.brandDraftService.updateSocialPlatformsOrder(
      currentUser, 
      id, 
      updateSocialPlatformsOrderDto
    );
  }

  @Get("/draft/:id/blocks")
  @ApiOperation({
    summary: "Get brand draft blocks",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get brand draft blocks successfully",
    type: [BrandBlockDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  getBrandBlocksDraft(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    return this.brandDraftService.getBlocks(currentUser, id);
  }

  @Post("/draft/:id/blocks")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Create brand draft blocks",
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Create brand draft blocks successfully",
    type: [BrandBlockDraft]
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  createBrandBlockDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createBrandBlockDto: BrandBlockDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.brandDraftService.createBlock(
      currentUser, 
      id, 
      createBrandBlockDto, 
      image
    );
  }

  @Put("/draft/:id/blocks/order")
  @HttpCode(204)
  @ApiOperation({
    summary: "Update brand draft blocks order",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Update brand draft blocks order successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async updateBrandBlockOrderDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateBlockOrderDto: UpdateBlockOrderDto
  ) {
    await this.brandDraftService.updateBlocksOrder(
      currentUser,
      id,
      updateBlockOrderDto
    );
    return;
  }

  @Put("/draft/:id/blocks/:blockId")
  @UseInterceptors(FileInterceptor("image"))
  @ApiOperation({
    summary: "Update brand draft block",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update brand draft block successfully",
    type: BrandBlockDraft
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateBrandBlockDraft(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,  
    @Param("blockId", ParseIntPipe) blockId: number,
    @Body() updateBrandBlockDto: BrandBlockDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.brandDraftService.updateBlock(
      currentUser,
      brandId,
      blockId,
      updateBrandBlockDto,
      image
    )
  }
  
  @Delete("/draft/:id/blocks/:blockId")
  @ApiOperation({
    summary: "Delete brand draft block",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Delete brand draft block successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid brand id": {
            value: "Invalid brand id"
          },
          "You don't have permission to edit this brand": {
            value: "You don't have permission to edit this brand"
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
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async deleteBlock(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("blockId", ParseIntPipe) blockId: number
  ) {
    await this.brandDraftService.removeBlock(currentUser, brandId, blockId);
    return;
  }
}
