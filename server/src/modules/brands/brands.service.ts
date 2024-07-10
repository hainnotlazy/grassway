import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, BrandSocialPlatforms, Brand, BrandMember, BrandMemberRole, BrandDraft, BrandSocialPlatformsDraft, Url, TaggedUrl, UrlAnalytics, BrandBlock, BrandBlockDraft } from 'src/entities';
import { DataSource, ILike, Not, Repository } from 'typeorm';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { CreateBrandDto, CreateLinkDto, UpdateQrCodeDto } from './dtos';
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

    const existedBrand = this.brandRepository.findOne({  
      where: {
        id,
        members: {
          user_id: currentUser.id
        }
      },
    });

    if (!existedBrand) {
      throw new BadRequestException("Brand not found or you are not a member of this brand"); 
    }

    return existedBrand;
  }

  /**
   * Describe: Get brand by prefix
  */
  async getBrandByPrefix(prefix: string) {
    const existedBrand = await this.brandRepository.findOne({
      where: {
        prefix
      },
      relations: ["social_platforms", "blocks", "blocks.url"],
      order: {
        blocks: {
          order: "DESC"
        }
      }
    });
    if (!existedBrand) {
      throw new NotFoundException("Brand did not exist!");
    }

    return existedBrand;
  }

  /**
   * Describe: Get links
  */
  async getLinks(currentUser: User, brandId: string, options: GetUrlsOptions) {
    this.validateBrandId(brandId);

    const existedBrand = await this.getBrand(currentUser, brandId);
    if (!existedBrand) {
      throw new BadRequestException("Brand not found or you are not a member of this brand");
    }

    return this.urlsService.getUrls(
      currentUser, 
      existedBrand, 
      options,
      `/api/brands/${brandId}/urls`
    );
  }

  /**
   * Describe: Get filtered links
  */
  async getFilteredLinks(
    currentUser: User, 
    brandId: string, 
    query: string
  ) {
    this.validateBrandId(brandId);

    const brandCondition = {
      id: brandId,
      members: {
        user_id: currentUser.id
      }
    };

    return await this.urlRepository.find({
      where: [
        { 
          brand: brandCondition,
          title: ILike(`%${query}%`)
        },
        {
          brand: brandCondition,
          origin_url: ILike(`%${query}%`)
        },
        {
          brand: brandCondition,
          back_half: ILike(`%${query}%`)
        },
        {
          brand: brandCondition,
          custom_back_half: ILike(`%${query}%`)
        }
      ],
      order: {
        id: "DESC"
      },
      take: 5
    });
  }

  /**
   * Describe: Get members
  */
  async getMembers(currentUser: User, brandId: string) {
    this.validateBrandId(brandId);

    return await this.brandMemberRepository.find({
      where: {
        brand_id: brandId,
        user_id: Not(currentUser.id)
      },
      relations: ["user"],
      order: {
        role: "ASC"
      }
    })
  }

  /**
   * Describe: Get role
  */
  async getRole(currentUser: User, brandId: string) {
    this.validateBrandId(brandId);

    return this.brandMemberRepository.findOne({
      where: {
        brand_id: brandId,
        user_id: currentUser.id
      }
    });
  }

  /**
   * Describe: Create brand
  */
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
      throw new InternalServerErrorException("Failed to create brand");
    } finally {
      await queryRunner.release();
    }
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

    const existedBrand = await this.getBrand(currentUser, brandId);
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    return await this.urlsService.shortenUrl(currentUser, createLinkDto, existedBrand);
  }

  /**
   * Describe: Validate brand prefix
  */
  async validateBrandPrefix(prefix: string) {
    const existedBrand = await this.brandRepository.findOneBy({
      prefix
    });

    return existedBrand;
  }

  /**
   * Describe: Update qr code settings
  */
  async updateQrCodeSettings(
    currentUser: User,
    brandId: string,
    updateQrCodeDto: UpdateQrCodeDto
  ) {
    this.validateBrandId(brandId);

    const existedBrand = await this.getBrand(currentUser, brandId);
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    Object.assign(existedBrand, updateQrCodeDto);
    
    return await this.brandRepository.save(existedBrand);
  }

  /**
   * Describe: Transfer ownership
  */
  async transferOwnership(
    currentUser: User,
    brandId: string,
    memberId: number
  ) {
    this.validateBrandId(brandId);
    this.isBrandOwner(currentUser, brandId);
    if (currentUser.id === memberId) {
      throw new BadRequestException("You can't transfer ownership to yourself");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(BrandMember, {
        brand_id: brandId,
        user_id: memberId
      }, {
        role: BrandMemberRole.OWNER
      });

      await queryRunner.manager.update(BrandMember, {
        brand_id: brandId,
        user_id: currentUser.id
      }, {
        role: BrandMemberRole.MEMBER
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed to transfer ownership");
    } finally {
      queryRunner.release();
    }
  }

  /**
   * Describe: Delete brand
  */
  async deleteBrand(currentUser: User, brandId: string) {
    this.validateBrandId(brandId);
    this.isBrandOwner(currentUser, brandId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(BrandBlock, { brand_id: brandId });
      await queryRunner.manager.delete(BrandBlockDraft, { brand_id: brandId });
      await queryRunner.manager.delete(BrandSocialPlatforms, { brand_id: brandId });
      await queryRunner.manager.delete(BrandSocialPlatformsDraft, { brand_id: brandId });
      await queryRunner.manager.delete(BrandMember, { brand_id: brandId });

      const urls = await queryRunner.manager.find(Url, {
        where: {
          brand: {
            id: brandId
          }
        }
      });
      for (const url of urls) {
        await queryRunner.manager.delete(UrlAnalytics, { url_id: url.id });
        await queryRunner.manager.delete(Url, { id: url.id });
      }

      await queryRunner.manager.delete(BrandDraft, { brand_id: brandId });
      await queryRunner.manager.delete(Brand, { id: brandId });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed to delete brand");
    } finally {
      await queryRunner.release();
    }
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
      throw new InternalServerErrorException("Failed to delete brand link");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Describe: Remove member
  */
  async removeMember(currentUser: User, brandId: string, memberId: number) {
    this.validateBrandId(brandId);
    this.isBrandOwner(currentUser, brandId);
    if (currentUser.id === memberId) {
      throw new BadRequestException("You can't remove yourself");
    }

    return await this.brandMemberRepository.delete({
      brand_id: brandId,
      user_id: memberId
    })
  }

  /**
   * Describe: Validate brand id
  */
  validateBrandId(brandId: string): void {
    if (!isUUID(brandId)) {
      throw new BadRequestException("Invalid brand id");
    }
  }
  
  private async getBrand(
    currentUser: User,
    brandId: string,
    relations: string[] = []
  ) {
    return await this.brandRepository.findOne({
      where: {
        id: brandId,
        members: {
          user_id: currentUser.id
        }
      },
      relations
    })
  }

  private async isBrandOwner(currentUser: User, brandId: string) {
    const isOwner = await this.brandMemberRepository.findOneBy({
      brand_id: brandId,
      user_id: currentUser.id,
      role: BrandMemberRole.OWNER
    });
    if (!isOwner) {
      throw new BadRequestException("You are not owner of this brand to do this action");
    }
  }
}
