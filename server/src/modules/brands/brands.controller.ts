import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto, BrandBlockDto, UpdateBlockOrderDto, CreateLinkDto, UpdateQrCodeDto, HandleInvitationDto } from './dtos';
import { BrandsService } from './brands.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandDraftService } from './brand-draft.service';
import { LinkActiveOptions, LinkTypeOptions } from 'src/common/models';
import { SendInvitationDto } from './dtos/send-invitation.dto';
import { UpdateShortenUrlDto } from '../urls/dtos';

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

  @Get("/:id/members")
  getMembers(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getMembers(currentUser, id);
  }

  @Get("/:id/role")
  getRole(@CurrentUser() currentUser: User, @Param("id") id: string) {
    return this.brandsService.getRole(currentUser, id);
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

  @Get("/:id/urls/:linkId")
  getLinkById(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("linkId", ParseIntPipe) linkId: number
  ) {
    return this.brandsService.getLinkById(currentUser, brandId, linkId);
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

  @Post("/:id/members/send-invitation")
  sendInvitation(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() sendInvitationDto: SendInvitationDto
  ) {
    return this.brandsService.sendInvitation(currentUser, id, sendInvitationDto.ids);
  }


  @Post("/:id/urls")
  createLink(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() createLinkDto: CreateLinkDto
  ) {
    return this.brandsService.createLink(currentUser, id, createLinkDto);
  }

  @Put("/:id/publish-changes")
  @HttpCode(204)
  async publishChanges(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string
  ) {
    await this.brandsService.publishChanges(currentUser, id);
    return;
  }

  @Put("/:id/members/handle-invitation")
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
  updateQrCodeSettings(
    @CurrentUser() currentUser: User,
    @Param("id") id: string,
    @Body() updateQrCodeDto: UpdateQrCodeDto
  ) {
    return this.brandsService.updateQrCodeSettings(currentUser, id, updateQrCodeDto);
  }

  @Put("/:id/urls/:urlId")
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
  async transferOwnership(
    @CurrentUser() currentUser: User,
    @Param("id") brandId: string,
    @Param("memberId", ParseIntPipe) memberId: number
  ) {
    await this.brandsService.transferOwnership(currentUser, brandId, memberId);
    return;
  }

  @Delete("/:id")
  async deleteBrand(@CurrentUser() currentUser: User, @Param("id") id: string) {
    await this.brandsService.deleteBrand(currentUser, id);
    return;
  }

  @Delete("/:id/urls/:urlId")
  async deleteLink(
    @CurrentUser() currentUser: User, 
    @Param("id") brandId: string, 
    @Param("urlId", ParseIntPipe) urlId: number) {
    await this.brandsService.removeUrl(currentUser, brandId, urlId);
    return;
  } 

  @Delete("/:id/members/leave")
  async leaveBrand(@CurrentUser() currentUser: User, @Param("id") brandId: string) {
    return this.brandsService.leaveBrand(currentUser, brandId);
  }

  @Delete("/:id/members/:memberId")
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
