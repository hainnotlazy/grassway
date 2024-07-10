import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto, BrandBlockDto, UpdateBlockOrderDto, CreateLinkDto, UpdateQrCodeDto } from './dtos';
import { BrandsService } from './brands.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandDraftService } from './brand-draft.service';
import { LinkActiveOptions, LinkTypeOptions } from 'src/common/models';

@Controller('brands')
export class BrandsController {
  constructor(
    private brandsService: BrandsService,
    private brandDraftService: BrandDraftService
  ) {}

  @Get()
  getBrands(@CurrentUser() currentUser: User) {
    return this.brandsService.getBrands(currentUser);
  }

  @Get("/validate-prefix")
  async validateBrandPrefix(@Query("prefix", new DefaultValuePipe("")) prefix: string) {
    return !(await this.brandsService.validateBrandPrefix(prefix));
  }

  @Get("/:id")
  getBrand(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getBrandById(currentUser, id);
  }

  @PublicRoute()
  @Get("/prefix/:prefix")
  getBrandByPrefix(@Param("prefix") prefix: string) {
    return this.brandsService.getBrandByPrefix(prefix);
  }

  @Get("/:id/urls")
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
  getFilteredLinks(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Query("query", new DefaultValuePipe("")) query: string,
  ) {
    return this.brandsService.getFilteredLinks(currentUser, id, query);
  }

  @Post()
  @UseInterceptors(FileInterceptor("logo"))
  createBrand(
    @CurrentUser() currentUser: User,
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.brandsService.createBrand(currentUser, createBrandDto, logo);
  }

  @Post("/:id/urls")
  createLink(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createLinkDto: CreateLinkDto
  ) {
    return this.brandsService.createLink(currentUser, id, createLinkDto);
  }

  @Put("/:id/qr-code")
  updateQrCodeSettings(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateQrCodeDto: UpdateQrCodeDto
  ) {
    return this.brandsService.updateQrCodeSettings(currentUser, id, updateQrCodeDto);
  }

  @Delete("/:id/urls/:urlId")
  async deleteLink(
    @CurrentUser() currentUser: User, 
    @Param("id") brandId: string, 
    @Param("urlId", ParseIntPipe) urlId: number) {
    await this.brandsService.removeUrl(currentUser, brandId, urlId);
    return;
  } 

  /** Routes to interact with brand draft */
  // -------------------------------------

  @Get("/draft/prefix/:prefix")
  getBrandDraftByPrefix(
    @CurrentUser() currentUser: User,
    @Param("prefix") prefix: string
  ) {
    return this.brandDraftService.getBrandByPrefix(currentUser, prefix);
  }

  @Get("/draft/:id/design")
  getBrandDesignDraft(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    return this.brandDraftService.getDesign(currentUser, id);
  }

  @Put("/draft/:id/design")
  @UseInterceptors(FileInterceptor("logo"))
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
  getBrandBlocksDraft(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    return this.brandDraftService.getBlocks(currentUser, id);
  }

  @Post("/draft/:id/blocks")
  @UseInterceptors(FileInterceptor("image"))
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
  async deleteBlock(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("blockId", ParseIntPipe) blockId: number
  ) {
    await this.brandDraftService.removeBlock(currentUser, brandId, blockId);
    return;
  }
}
