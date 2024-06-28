import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandSocialPlatforms } from 'src/entities/brand-social-platforms.entity';
import { Brand } from 'src/entities/brand.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBrandDto } from './dtos/create-brand.dto';
import { UploadFileService } from 'src/shared/services/upload-file/upload-file.service';
import { BrandMember, BrandMemberRole } from 'src/entities/brand-member.entity';
import { BrandDraft } from 'src/entities/brand-draft.entity';
import { BrandSocialPlatformsDraft } from 'src/entities/brand-social-platforms-draft.entity';

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
    private readonly dataSource: DataSource,
    private readonly uploadFileService: UploadFileService
  ) {}

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

  async getBrandById(currentUser: User, id: string) {
    return this.brandRepository.findOne({  
      where: {
        id,
        members: {
          user: {
            id: currentUser.id
          }
        }
      },
    });
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

  async validateBrandPrefix(prefix: string) {
    const existedBrand = await this.brandRepository.findOneBy({
      prefix
    });

    return existedBrand;
  }
}
