import { Body, Controller, DefaultValuePipe, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateBrandDto } from './dtos/create-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(
    private brandsService: BrandsService
  ) {}

  @Get()
  getBrands(@CurrentUser() currentUser: User) {
    return this.brandsService.getBrands(currentUser);
  }

  @Get("/validate-prefix")
  async validateBrandPrefix(@Query("prefix", new DefaultValuePipe("")) prefix: string) {
    return !(await this.brandsService.validateBrandPrefix(prefix));
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
}
