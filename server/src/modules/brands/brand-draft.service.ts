import { UpdateSocialPlatformsDto } from './dtos/update-social-platforms.dto';
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBrandDesignDto, UpdateSocialPlatformsOrderDto } from './dtos';
import { User, BrandDraft, BrandMember, BrandSocialPlatformsDraft } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { BrandsGateway } from './brands.gateway';
import { BrandsService } from './brands.service';

@Injectable()
export class BrandDraftService {
  constructor(
    @InjectRepository(BrandDraft)
    private readonly brandDraftRepository: Repository<BrandDraft>,
    @InjectRepository(BrandMember)
    private readonly brandMemberRepository: Repository<BrandMember>,
    @InjectRepository(BrandSocialPlatformsDraft)
    private readonly brandSocialPlatformsDraftRepository: Repository<BrandSocialPlatformsDraft>,
    private brandsService: BrandsService,
    private dataSource: DataSource,
    private brandsGateway: BrandsGateway,
    private uploadFileService: UploadFileService
  ) {}
  
  /**
   * Describe: Get brand by prefix
  */
  async getBrandByPrefix(prefix: string) {
    const brand = await this.brandDraftRepository.findOne({
      where: {
        prefix
      },
      relations: ["social_platforms"]
    })
    if (!brand) {
      throw new NotFoundException("Brand not found or you are not a member of this brand");
    }

    return brand;
  }

  /**
   * Describe: Get brand design
  */
  async getBrandDesign(currentUser: User, brandId: string) {
    this.brandsService.validateBrandId(brandId);

    const brand = await this.brandDraftRepository.findOne({
      where: {
        brand_id: brandId,
        brand: {
          members: {
            user_id: currentUser.id
          }
        }
      },
      relations: ["social_platforms"]
    })
    if (!brand) {
      throw new BadRequestException("Brand not found or you are not a member of this brand");
    }

    return brand;
  }

  /** 
   * Describe: Update brand design
  */
  async updateBrandDesign(
    currentUser: User,
    brandId: string,
    updateBrandDesignDto: UpdateBrandDesignDto,
    logo: Express.Multer.File
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.brandDraftRepository.findOne({
      where: {
        brand_id: brandId,
        brand: {
          members: {
            user_id: currentUser.id
          }
        }
      }
    });
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Save brand logo
    let savedLogoPath = null;
    if (logo) {
      savedLogoPath = this.uploadFileService.saveBrandLogo(logo);
    }

    try {
      // Update brand draft
      Object.assign(existedBrand, updateBrandDesignDto);
      if (savedLogoPath) {
        existedBrand.logo = savedLogoPath;
      }
      const updatedBrandDraft = await queryRunner.manager.save(existedBrand);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Push new design to live preview
      await this.brandsGateway.emitNewDesign(currentUser.id, updatedBrandDraft);

      return updatedBrandDraft;
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      logo && this.uploadFileService.removeOldFile(savedLogoPath);
      throw new InternalServerErrorException("Failed when update brand draft");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Describe: Update brand social platforms order
  */
  async updateBrandSocialPlatformsOrder(
    currentUser: User,
    brandId: string,
    updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.brandSocialPlatformsDraftRepository.findOne({
      where: {
        brand_id: brandId,
        brand_draft: {
          brand: {
            members: {
              user_id: currentUser.id
            }
          }
        }
      }
    })
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    Object.assign(existedBrand, updateSocialPlatformsOrderDto);
    return this.brandSocialPlatformsDraftRepository.save(existedBrand);
  }

  /**
   * Describe: Update brand social platforms
  */
  async updateBrandSocialPlatform(
    currentUser: User,
    brandId: string,
    updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.brandSocialPlatformsDraftRepository.findOneBy({
      brand_id: brandId,
      brand_draft: {
        brand: {
          members: {
            user: {
              id: currentUser.id
            }
          }
        }
      }
    })
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    Object.assign(existedBrand, updateSocialPlatformsDto);
    return await this.brandSocialPlatformsDraftRepository.save(existedBrand);
  }
}