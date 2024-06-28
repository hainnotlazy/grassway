import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UpdateBrandDesignDto } from './dtos/update-brand-design.dto';
import { BrandDraft } from 'src/entities/brand-draft.entity';
import { DataSource, Repository } from 'typeorm';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { BrandMember } from 'src/entities/brand-member.entity';

@Injectable()
export class BrandDraftService {
  constructor(
    @InjectRepository(BrandDraft)
    private readonly brandDraftRepository: Repository<BrandDraft>,
    @InjectRepository(BrandMember)
    private readonly brandMemberRepository: Repository<BrandMember>,
    private dataSource: DataSource,
    private uploadFileService: UploadFileService
  ) {}

  async getBrandDesignDraft(currentUser: User, brandId: string) {
    const isMember = await this.brandMemberRepository.findOneBy({
      brand_id: brandId,
      user_id: currentUser.id,
    })

    if (!isMember) {
      throw new BadRequestException("You don't have permission to view this brand");
    }

    return this.brandDraftRepository.findOneBy({
      brand_id: brandId
    });
  }

  async updateDesign(
    currentUser: User,
    brandId: string,
    updateBrandDesignDto: UpdateBrandDesignDto,
    logo: Express.Multer.File
  ) {
    const isMember = await this.brandMemberRepository.findOneBy({
      brand_id: brandId,
      user_id: currentUser.id,
    })

    if (!isMember) {
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
      const existedBrandDraft = await this.brandDraftRepository.findOneBy({
        brand_id: brandId
      });

      // Update brand draft
      Object.assign(existedBrandDraft, updateBrandDesignDto);
      if (savedLogoPath) {
        existedBrandDraft.logo = savedLogoPath;
      }
      const updatedBrandDraft = await queryRunner.manager.save(existedBrandDraft);

      // Commit transaction
      await queryRunner.commitTransaction();
      return updatedBrandDraft;
    } catch (error) {
      // Rollback transaction
      await queryRunner.rollbackTransaction();
      logo && this.uploadFileService.removeOldFile(savedLogoPath);
      throw new InternalServerErrorException("Failed when create brand draft");
    } finally {
      await queryRunner.release();
    }
  }
}