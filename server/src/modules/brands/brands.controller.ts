import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto, BrandBlockDto, UpdateBlockOrderDto, CreateLinkDto } from './dtos';
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

  @Post("/:id/urls")
  createLink(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createLinkDto: CreateLinkDto
  ) {
    return this.brandsService.createLink(currentUser, id, createLinkDto);
  }

  @PublicRoute()
  @Get("/prefix/:prefix")
  getBrandByPrefix(@Param("prefix") prefix: string) {
    return this.brandDraftService.getBrandByPrefix(prefix);
  }

  @Get("/draft/:id/design")
  getBrandDesignDraft(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandDraftService.getBrandDesign(currentUser, id);
  }

  @Get("/draft/:id/blocks")
  getBrandBlocksDraft(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandDraftService.getBrandBlocks(currentUser, id);
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

  @Post("/draft/:id/blocks")
  @UseInterceptors(FileInterceptor("image"))
  createBrandBlock(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createBrandBlockDto: BrandBlockDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.brandDraftService.createBrandBlock(
      currentUser, 
      id, 
      createBrandBlockDto, 
      image
    );
  }

  @Put("/draft/:id/design")
  @UseInterceptors(FileInterceptor("logo"))
  updateBrandDesignDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateBrandDesignDto: UpdateBrandDesignDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.brandDraftService.updateBrandDesign(
      currentUser, 
      id, 
      updateBrandDesignDto, 
      logo
    );
  }

  @Put("/draft/:id/social-platforms/order") 
  updateBrandSocialPlatformsDraftOrder(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    return this.brandDraftService.updateBrandSocialPlatformsOrder(
      currentUser, 
      id, 
      updateSocialPlatformsOrderDto
    );
  }

  @Put("/draft/:id/social-platforms") 
  updateBrandSocialPlatformsDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    return this.brandDraftService.updateBrandSocialPlatform(
      currentUser, 
      id, 
      updateSocialPlatformsDto
    );
  }

  @Put("/draft/:id/blocks/order")
  updateBrandBlockOrderDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateBlockOrderDto: UpdateBlockOrderDto
  ) {
    return this.brandDraftService.updateBrandBlocksOrder(
      currentUser,
      id,
      updateBlockOrderDto
    )
  }

  @Put("/draft/:id/blocks/:blockId")
  @UseInterceptors(FileInterceptor("image"))
  updateBrandBlockDraft(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,  
    @Param("blockId", ParseIntPipe) blockId: number,
    @Body() updateBrandBlockDto: BrandBlockDto,
    @UploadedFile() image: Express.Multer.File
  ) {
    return this.brandDraftService.updateBrandBlock(
      currentUser,
      id,
      blockId,
      updateBrandBlockDto,
      image
    )
  }

  @Delete("/:id/urls/:urlId")
  deleteLink(
    @CurrentUser() currentUser: User, 
    @Param("id") brandId: string, 
    @Param("urlId", ParseIntPipe) urlId: number) {
    return this.brandsService.removeUrl(currentUser, brandId, urlId);
  } 
}
