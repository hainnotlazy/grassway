import { Body, Controller, DefaultValuePipe, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto } from './dtos';
import { BrandsService } from './brands.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandDraftService } from './brand-draft.service';

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
    return this.brandDraftService.getBrandByPrefix(prefix);
  }

  @Get("/draft/:id/design")
  getBrandDesignDraft(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandDraftService.getBrandDesign(currentUser, id);
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
}
