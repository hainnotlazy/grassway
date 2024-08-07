import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBrandDesignDto, UpdateSocialPlatformsOrderDto, UpdateSocialPlatformsDto, BrandBlockDto, UpdateBlockOrderDto } from './dtos';
import { User, BrandDraft, BrandSocialPlatformsDraft, BrandBlockDraft, BlockType, Url, Brand, BrandMember } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { BrandsGateway } from './brands.gateway';
import { BrandsService } from './brands.service';
import { UrlsService } from '../urls/urls.service';

@Injectable()
export class BrandDraftService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(BrandDraft)
    private readonly brandDraftRepository: Repository<BrandDraft>,
    @InjectRepository(BrandSocialPlatformsDraft)
    private readonly brandSocialPlatformsDraftRepository: Repository<BrandSocialPlatformsDraft>,
    @InjectRepository(BrandBlockDraft)
    private readonly brandBlockDraftRepository: Repository<BrandBlockDraft>,
    @InjectRepository(BrandMember)
    private readonly brandMemberRepository: Repository<BrandMember>,
    private brandsService: BrandsService,
    private urlsService: UrlsService,
    private dataSource: DataSource,
    private brandsGateway: BrandsGateway,
    private uploadFileService: UploadFileService
  ) {}

  /**
   * Describe: Get brand by prefix
  */
  async getBrandByPrefix(currentUser: User, prefix: string) {
    const existedBrand = await this.brandDraftRepository.findOne({
      where: {
        prefix,
        brand: {
          members: {
            user_id: currentUser.id
          }
        },
      },
      relations: ["social_platforms", "blocks", "blocks.url"],
      order: {
        blocks: {
          order: "DESC"
        }
      }
    })
    if (!existedBrand) {
      throw new NotFoundException("Brand not found or you are not a member of this brand");
    }

    return existedBrand;
  }

  /**
   * Describe: Get brand design
  */
  async getDesign(currentUser: User, brandId: string) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.getBrandById(currentUser, brandId, ["social_platforms"]);
    if (!existedBrand) {
      throw new BadRequestException("Brand not found or you are not a member of this brand");
    }

    return existedBrand;
  }

  /** 
   * Describe: Get brand blocks
  */
  async getBlocks(currentUser: User, brandId: string) {
    this.brandsService.validateBrandId(brandId);

    const blocks = await this.brandBlockDraftRepository.find({
      where: {
        brand_id: brandId,
        brand_draft: {
          brand: {
            members: {
              user_id: currentUser.id
            }  
          }
        }
      },
      order: {
        order: "DESC"
      },
      relations: ["url"]
    })

    return blocks;
  }

  /**
   * Describe: Create brand block 
  */ 
  async createBlock(
    currentUser: User,
    brandId: string,
    createBrandBlockDto: BrandBlockDto,
    image: Express.Multer.File
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.brandRepository.findOne({
      where: {
        id: brandId,
        members: {
          user_id: currentUser.id
        }
      }
    })
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    const {
      type,
      title,
      description,
      youtube_url,
      image_ratio,
      url: newOriginUrl, 
      url_id: urlId
    } = createBrandBlockDto;
    let url: Url;
    let savedImagePath = null;
    if (createBrandBlockDto.type === BlockType.IMAGE && image) {
      savedImagePath = this.uploadFileService.saveBlockImage(image);
    }

    if (newOriginUrl) {
      url = await this.urlsService.shortenUrl(
        null, 
        { origin_url: newOriginUrl },
        existedBrand
      );
    } else if (urlId) {
      url = await this.urlsService.getUrlById(urlId);
    }

    const lastBlockOrder = await this.brandBlockDraftRepository.findOne({
      where: {
        brand_id: brandId
      },
      order: {
        order: "DESC"
      }
    });
    const order = lastBlockOrder ? lastBlockOrder.order + 1 : 0;

    const block = this.brandBlockDraftRepository.create({
      brand_id: brandId,
      image: savedImagePath,
      image_ratio,
      type,
      title,
      description,
      youtube_url,
      url,
      order
    });
    const savedBlock = await this.brandBlockDraftRepository.save(block);

    // Push block changes to live preview (allow it run even though returned savedBlock to controller)
    this.pushBlockChangesToMembers(brandId);

    return savedBlock;
  }

  /**
   * Describe: Update brand block
  */
  async updateBlock(
    currentUser: User,
    brandId: string,
    blockId: number,
    updateBrandBlockDto: BrandBlockDto,
    image: Express.Multer.File
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBlock = await this.brandBlockDraftRepository.findOne({
      where: {
        id: blockId,
        brand_draft: {
          brand_id: brandId,
          brand: {
            members: {
              user_id: currentUser.id
            }
          }
        }
      }
    });
    if (!existedBlock) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    const {
      url: newOriginUrl, 
      url_id: urlId
    } = updateBrandBlockDto;
    let url: Url;
    let oldImagePath = null;
    let savedImagePath = null;

    if (newOriginUrl) {
      url = await this.urlsService.shortenUrl(
        null, 
        { origin_url: newOriginUrl },
        await this.brandRepository.findOneBy({ id: brandId })
      );
    } else if (urlId) {
      url = await this.urlsService.getUrlById(urlId);
    }

    Object.assign(existedBlock, updateBrandBlockDto);
    existedBlock.url = url;
    if (updateBrandBlockDto.type === BlockType.IMAGE && image) {
      savedImagePath = this.uploadFileService.saveBlockImage(image);
      oldImagePath = existedBlock.image;
      existedBlock.image = savedImagePath;
    }
    
    const updatedBlock = await this.brandBlockDraftRepository.save(existedBlock);

    // Push block changes to live preview (allow it run even though returned updatedBlock to controller)
    this.pushBlockChangesToMembers(brandId);

    // Remove old block image
    if (
      updateBrandBlockDto.type === BlockType.IMAGE 
      && image 
      && oldImagePath
    ) {
      this.uploadFileService.removeOldFile(oldImagePath);
    }

    return updatedBlock;
  }

  /** 
   * Describe: Update brand blocks order
  */
  async updateBlocksOrder(
    currentUser: User,
    brandId: string,
    updateBlocksOrderDto: UpdateBlockOrderDto
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.getBrandById(currentUser, brandId);
    if (!existedBrand) {  
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    const { ids: blockIds } = updateBlocksOrderDto;
    const cases = blockIds
      .map((id, index) => `WHEN id = '${id}' THEN ${blockIds.length - index}`)
      .join(' ');

    const query = this.brandBlockDraftRepository
    .createQueryBuilder()
    .update(BrandBlockDraft)
    .set({ order: () => `CASE ${cases} END` })
    .where('id IN (:...ids)', { ids: blockIds })
    .andWhere('brand_id = :brandId', { brandId })

    await query.execute();

    // Push block changes to live preview (allow it run even though returned done to controller)
    this.pushBlockChangesToMembers(brandId);
  }

  /** 
   * Describe: Update brand design
  */
  async updateDesign(
    currentUser: User,
    brandId: string,
    updateBrandDesignDto: UpdateBrandDesignDto,
    logo: Express.Multer.File
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.getBrandById(currentUser, brandId);
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
      savedLogoPath = await this.uploadFileService.saveBrandLogo(logo);
    }

    try {
      // Update brand design
      Object.assign(existedBrand, updateBrandDesignDto);
      if (savedLogoPath) {
        existedBrand.logo = savedLogoPath;
      }
      const updatedBrand = await queryRunner.manager.save(existedBrand);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Push changes to live preview (allow it run even though returned updatedBrand to controller)
      this.pushChangesToMembers(existedBrand);

      return updatedBrand;
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      logo && this.uploadFileService.removeOldFile(savedLogoPath);
      throw new InternalServerErrorException("Failed to update brand design draft!");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Describe: Update brand social platforms
  */
  async updateSocialPlatform(
    currentUser: User,
    brandId: string,
    updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.getBrandById(currentUser, brandId, ["social_platforms"]);
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    Object.assign(existedBrand.social_platforms, updateSocialPlatformsDto);
    const updatedBrand = await this.brandSocialPlatformsDraftRepository.save(existedBrand.social_platforms);

    // Push changes to live preview (allow it run even though returned updatedBrand to controller)
    this.pushChangesToMembers(existedBrand);

    return updatedBrand;
  }

  /**
   * Describe: Update brand social platforms order
  */
  async updateSocialPlatformsOrder(
    currentUser: User,
    brandId: string,
    updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.getBrandById(currentUser, brandId, ["social_platforms"]);
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    Object.assign(existedBrand.social_platforms, updateSocialPlatformsOrderDto);
    const updatedBrand = await this.brandSocialPlatformsDraftRepository.save(existedBrand.social_platforms);

    // Push changes to live preview (allow it run even though returned updatedBrand to controller)
    this.pushChangesToMembers(existedBrand);

    return updatedBrand;
  }

  /**
   * Describe: Discard changes
  */
  async discardChanges(currentUser: User, brandId: string) {
    this.brandsService.validateBrandId(brandId);

    const existedBrand = await this.brandRepository.findOne({
      where: {
        id: brandId,
        members: {
          user_id: currentUser.id
        }
      },
      relations: ["blocks", "blocks.url", "social_platforms"]
    })
    if (!existedBrand) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(BrandSocialPlatformsDraft, {
        brand_id: brandId
      }, existedBrand.social_platforms);

      await queryRunner.manager.delete(BrandBlockDraft, {});
      for (const block of existedBrand.blocks) {
        delete block.id;
        await queryRunner.manager.save(BrandBlockDraft, block);
      }

      delete existedBrand.id;
      delete existedBrand.qr_code_background_color;
      delete existedBrand.qr_code_foreground_color;
      delete existedBrand.created_at;
      delete existedBrand.blocks;
      delete existedBrand.social_platforms;
      await queryRunner.manager.update(BrandDraft, {
        brand_id: brandId
      }, existedBrand);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed to discard changes");
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Describe: Remove brand block
  */
  async removeBlock(
    currentUser: User,
    brandId: string,
    blockId: number
  ) {
    this.brandsService.validateBrandId(brandId);

    const existedBlock = await this.brandBlockDraftRepository.findOne({
      where: {
        brand_id: brandId,
        id: blockId,
        brand_draft: {
          brand: {
            members: {
              user_id: currentUser.id
            }
          }
        }
      }
    });
    if (!existedBlock) {
      throw new BadRequestException("You don't have permission to edit this brand");
    }

    await this.brandBlockDraftRepository.remove(existedBlock);

    // Push changes to live preview (allow it run even though returned done to controller)
    this.pushBlockChangesToMembers(brandId);
  }

  /** 
   * Describe: Handle to push new draft changes to live preview to all members of brand
  */
  async pushChangesToMembers(latestDraft: BrandDraft): Promise<void> {
    await new Promise(async (resolve, reject) => {
      resolve(await this.brandMemberRepository.find({ 
        where: { 
          brand_id: latestDraft.brand_id,
          joined: true
        }
      }));
    }).then((members: BrandMember[]) => {
      for (const member of members) {
        this.brandsGateway.emitDraftChanged(member.user_id, latestDraft);
      }
    });
  }

  /**
   * Describe: Get brand by id
  */
  private async getBrandById(
    currentUser: User, 
    brandId: string,
    relations: string[] = [],
  ) {
    return await this.brandDraftRepository.findOne({
      where: {
        brand: {
          id: brandId,
          members: {
            user_id: currentUser.id
          }
        },
      },
      relations
    })
  }

  /**
   * Describe: Handle emit block changes to live preview to all members of brand
  */
  private async pushBlockChangesToMembers(brandId: string) {
    const existedBrand = await this.brandDraftRepository.findOne({
      where: {
        brand: {
          id: brandId,
          members: {
            joined: true
          }
        },
      },
      relations: ["blocks", "blocks.url", "brand", "brand.members"],
    })

    // Push changes to live preview
    for (const member of existedBrand.brand.members) {
      await this.brandsGateway.emitDraftChanged(member.user_id, existedBrand);
    }
  }
}