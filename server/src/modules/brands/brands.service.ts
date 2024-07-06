import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, BrandSocialPlatforms, Brand, BrandMember, BrandMemberRole, BrandDraft, BrandSocialPlatformsDraft, Url, TaggedUrl, UrlAnalytics, BrandBlock, BrandBlockDraft } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { CreateBrandDto, CreateLinkDto } from './dtos';
import { isUUID } from 'class-validator';
import { UrlsService } from '../urls/urls.service';
import { GetUrlsOptions } from 'src/common/models';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(BrandSocialPlatforms) 
    private readonly brandSocialPlatformsRepository: Repository<BrandSocialPlatforms>,
    @InjectRepository(BrandMember)
    private readonly brandMemberRepository: Repository<BrandMember>,
    @InjectRepository(BrandDraft)
    private readonly brandDraftRepository: Repository<BrandDraft>,
    @InjectRepository(BrandSocialPlatformsDraft)
    private readonly brandSocialPlatformsDraftRepository: Repository<BrandSocialPlatformsDraft>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    private readonly dataSource: DataSource,
    private readonly uploadFileService: UploadFileService,
    private readonly urlsService: UrlsService,
  ) {}

  /**
   * Describe: List all brands by user
  */
  async getBrands(currentUser: User) {
    return this.brandRepository.find({  
      where: {
        members: {
          user: {
            id: currentUser.id
          }
        }
      },
    });
  }

  /**
   * Describe: Get brand by id
  */
  async getBrandById(currentUser: User, id: string) {
    this.validateBrandId(id);

    const brand = this.brandRepository.findOne({  
      where: {
        id,
        members: {
          user: {
            id: currentUser.id
          }
        }
      },
    });

    if (!brand) {
      throw new BadRequestException("Brand not found");
    }

    return brand;
  }

  async createBrand(
    currentUser: User,
    createBrandDto: CreateBrandDto,
    logo: Express.Multer.File
  ) {
    // Validate brand
    const isPrefixExisted = !!(await this.validateBrandPrefix(createBrandDto.prefix));
    if (isPrefixExisted) {
      throw new BadRequestException("Brand prefix already existed");
    }

    // Create transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Save brand logo
    let savedLogoPath = null;
    if (logo) {
      savedLogoPath = this.uploadFileService.saveBrandLogo(logo);
    }

    try {
      // Save brand
      const brand = this.brandRepository.create({
        ...createBrandDto,
        logo: savedLogoPath
      });
      const savedBrand = await queryRunner.manager.save(brand);

      // Save brand owner
      const brandOwner = this.brandMemberRepository.create({
        brand: savedBrand,
        user: currentUser,
        role: BrandMemberRole.OWNER
      });
      await queryRunner.manager.save(brandOwner);

      // Save brand members
      if (createBrandDto.invited_users && createBrandDto.invited_users.length > 0) {
        for (const invitedUserId of createBrandDto.invited_users) {
          const existedUser = await this.userRepository.findOneBy({ id: invitedUserId });
          if (!existedUser) {
            continue;
          }
  
          const brandMember = this.brandMemberRepository.create({
            brand: savedBrand,
            user: existedUser,
            role: BrandMemberRole.MEMBER
          });
          await queryRunner.manager.save(brandMember);
        }
      }

      // Save brand social platforms
      const brandSocialPlatforms = this.brandSocialPlatformsRepository.create({
        brand: savedBrand,
        ...createBrandDto
      });
      await queryRunner.manager.save(brandSocialPlatforms);

      // Save brand draft
      const brandDraft = this.brandDraftRepository.create({
        ...savedBrand,
        brand: savedBrand
      });
      await queryRunner.manager.save(brandDraft);

      const brandSocialPlatformsDraft = this.brandSocialPlatformsDraftRepository.create({
        brand_id: savedBrand.id,
        ...createBrandDto
      });
      await queryRunner.manager.save(brandSocialPlatformsDraft);

      // Commit transaction
      await queryRunner.commitTransaction();
      return savedBrand;
    } catch (err) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      logo && this.uploadFileService.removeOldFile(savedLogoPath);
      throw new InternalServerErrorException("Failed when create brand");
    } finally {
      queryRunner.release();
    }
  }

  /**
   * Describe: Get links
  */
  async getLinks(currentUser: User, brandId: string, options: GetUrlsOptions) {
    this.validateBrandId(brandId);

    const existedBrand = await this.brandRepository.findOne({
      where: {
        id: brandId,
        members: {
          user: {
            id: currentUser.id
          }
        }
      }
    });
    if (!existedBrand) {
      throw new BadRequestException("Brand not found or you don't have permission to view this brand");
    }

    return this.urlsService.getUrls(
      currentUser, 
      existedBrand, 
      options,
      `/api/brands/${brandId}/urls`
    );
  }

  /**
   * Describe: Create link
  */
  async createLink(
    currentUser: User,
    brandId: string,
    createLinkDto: CreateLinkDto
  ) {
    this.validateBrandId(brandId);

    const existedBrand = await this.brandRepository.findOne({
      where: {
        id: brandId,
        members: {
          user: {
            id: currentUser.id
          }
        }
      }
    });
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    return await this.urlsService.shortenUrl(currentUser, createLinkDto, existedBrand);
  }

  async validateBrandPrefix(prefix: string) {
    const existedBrand = await this.brandRepository.findOneBy({
      prefix
    });

    return existedBrand;
  }

  /**
   * Describe: Remove url
  */
  async removeUrl(currentUser: User, brandId: string, urlId: number) {
    this.validateBrandId(brandId);

    const existedLink = await this.urlRepository.findOne({
      where: {
        id: urlId,
        brand: {
          id: brandId,
          members: {
            user_id: currentUser.id
          }
        }
      },
      relations: ["blocks", "blocks_draft"]
    })
    if (!existedLink) {
      throw new BadRequestException("You don't have permission to edit this brand");
    } else if (existedLink.blocks.length > 0 || existedLink.blocks_draft.length > 0) {
      throw new BadRequestException("You can't delete this link because it's being used in blocks");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(TaggedUrl, { 
        url_id: urlId
      });
      await queryRunner.manager.delete(UrlAnalytics, {
        url_id: urlId
      });
      await queryRunner.manager.delete(BrandBlock, {
        url: {
          id: urlId
        }
      });
      await queryRunner.manager.delete(BrandBlockDraft, {
        url: {
          id: urlId
        }
      });
      await queryRunner.manager.delete(Url, {
        id: urlId
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed when delete brand link");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Describe: Validate brand id
  */
  validateBrandId(brandId: string): void {
    if (!isUUID(brandId)) {
      throw new BadRequestException("Invalid brand id");
    }
  }
}
