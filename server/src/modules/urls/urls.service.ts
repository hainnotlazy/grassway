import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-paginate';
import { GetUrlsOptions, LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { v4 as uuidiv4 } from "uuid";
import * as CryptoJS from 'crypto-js';
import { CsvService } from 'src/shared/services/csv/csv.service';
import { ConfigService } from '@nestjs/config';
import { UpdateShortenUrlDto } from './dtos/update-shorten-url.dto';
import { TaggedUrl } from 'src/entities/tagged-url.entity';
import { TagsService } from '../tags/tags.service';
import { BulkSetTagUrlsDto } from './dtos/bulk-set-tag-urls.dto';
import { DeviceType } from './dtos/visit-url.dto';

@Injectable()
export class UrlsService {
  private readonly ENCRYPTION_SECRET = this.configService.get("ENCRYPTION_SECRET");

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    @InjectRepository(TaggedUrl)
    private taggedUrlRepository: Repository<TaggedUrl>,
    private dataSource: DataSource,
    private csvService: CsvService,
    private configService: ConfigService,
    private tagsService: TagsService
  ) {}

  async getUrlByBackHalf(backHalf: string) {
    const url = await this.urlRepository.findOneBy({ back_half: backHalf })
      || await this.urlRepository.findOneBy({ custom_back_half: backHalf });

    if (!url) {
      throw new NotFoundException("Url not found");
    }

    return url;
  }

  /** Describe: Get paginated urls by user */
  async getUrls(currentUser: User, options: GetUrlsOptions) {
    const { limit, page, isActive, linkTypeOptions, startDate, endDate, search, tagId } = options;

    // Create query builder
    const queryBuilder = this.urlRepository.createQueryBuilder("urls")
      .leftJoinAndSelect("urls.owner", "owner")
      .leftJoinAndSelect("urls.tags", "tags")
      .where("urls.owner = :ownerId", { ownerId: currentUser.id })
      .andWhere("urls.is_active = :isActive", { isActive })
    
    // Add filter link type
    if (linkTypeOptions === LinkTypeOptions.WITH_CUSTOM_BACK_HALVES) {
      queryBuilder.andWhere("urls.custom_back_half != ''");
    } else if (linkTypeOptions === LinkTypeOptions.WITHOUT_CUSTOM_BACK_HALVES) {
      queryBuilder.andWhere("urls.custom_back_half is null");
    }

    // Add filter date
    if (startDate) {
      queryBuilder.andWhere("urls.created_at > :startDate", { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere("urls.created_at < :endDate", { endDate });
    }

    // Add filter search
    if (search) {
      queryBuilder.andWhere(
        "(urls.origin_url ILIKE :search OR urls.custom_back_half ILIKE :search OR urls.title ILIKE :search)", 
        { search: `%${search}%` }
      );
    }

    // Add filter tag
    if (tagId) {
      queryBuilder.andWhere("tags.tag_id = :tagId", { tagId });
    }

    return paginate({
      limit,
      page,
      path: "/api/urls",
      select: [
        "id",
        "origin_url",
        "back_half",
        "shortened_url",
        "is_active",
        "tags"
      ],
      sortBy: [
        ["id", "DESC"],
      ]
    }, queryBuilder, {
      relations: ["tags"],
      sortableColumns: ["id"],
      maxLimit: 50
    })
  }

  async shortenUrl(currentUser: User, url: Partial<Url>) {
    const { origin_url, title, description, custom_back_half, password } = url;

    const backHalf = await this.generateBackHalf();

    // Check if custom_back_half is existed
    if (custom_back_half && !(await this.validateCustomBackHalf(backHalf))) {
      return null;
    }

    let encryptedPassword = null;
    if (password) {
      encryptedPassword = CryptoJS.AES.encrypt(password, this.ENCRYPTION_SECRET).toString();
    }
    const shortenedUrl = this.urlRepository.create({ 
      origin_url, 
      owner: currentUser,
      back_half: backHalf ,
      title,
      description,
      custom_back_half,
      password: password ? encryptedPassword : "",
      use_password: !!password,
    });

    return this.urlRepository.save(shortenedUrl);
  }

  /** 
   * Describe: Validate custom back half
   * @output: boolean, true if custom_back_half isn't existed, otherwise false
  */
  async validateCustomBackHalf(backHalf: string) {
    if (!backHalf) {
      return true;
    }
    return !(await this.urlRepository.findOneBy({ custom_back_half: backHalf }));
  }

  async accessProtectedUrl(url: Partial<Url>) {
    const { id, password } = url;

    const urlExisted = await this.urlRepository.findOneBy({ id });
    if (!urlExisted) {
      throw new NotFoundException("Url not found");
    }

    const decryptedPassword = CryptoJS.AES.decrypt(urlExisted.password, this.ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    if (password === decryptedPassword) {
      return urlExisted;
    }
    throw new BadRequestException("Password is incorrect");
  }

  async visitUrl(urlId: string, deviceType: DeviceType) {
    const query = this.urlRepository.createQueryBuilder().update(Url);

    if (deviceType === DeviceType.Desktop) {
      query.set({ visited_by_desktop: () => "visited_by_desktop + 1" });
    } else if (deviceType === DeviceType.Tablet) {
      query.set({ visited_by_tablet: () => "visited_by_tablet + 1" });
    } else if (deviceType === DeviceType.Mobile) {
      query.set({ visited_by_mobile: () => "visited_by_mobile + 1" });
    }

    return query.where("id = :id", { id: urlId })
      .execute();
  }

  async redirectSuccessUrl(urlId: string) {
    return this.urlRepository.createQueryBuilder()
      .update(Url)
      .set({ redirect_success: () => "redirect_success + 1" })
      .where("id = :id", { id: urlId })
      .execute();
  }

  async updateUrl(currentUser: User, urlId: string, updateUrl: UpdateShortenUrlDto) {
    let url = await this.urlRepository.findOne({
      where: {
        id: urlId,
        owner: {
          id: currentUser.id
        }
      },
      relations: ["tags"]
    });

    if (!url) {
      throw new NotFoundException("Url not found");
    }

    // Start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existedTags = url.tags;
      if (updateUrl.change_password) {
        Object.assign(url, updateUrl);
        if (updateUrl.password) {
          url.password = CryptoJS.AES.encrypt(updateUrl.password, this.ENCRYPTION_SECRET).toString();
          url.use_password = true;
        } else {
          url.password = null;
          url.use_password = false;
        }
      } else {
        updateUrl.password = url.password;
        Object.assign(url, updateUrl);
      }

      // Handle to save/update url's tags
      const newTagsId = updateUrl.tags || [];
      for (const existedTag of existedTags) {
        if (newTagsId.includes(existedTag.tag_id)) {
          newTagsId.splice(newTagsId.indexOf(existedTag.tag_id), 1);
        } else {
          await queryRunner.manager.remove(TaggedUrl, existedTag);
        }
      }

      for (const newTagId of newTagsId) {
        // Validate if tag id is valid
        if (!(await this.tagsService.findTag(currentUser, newTagId))) {
          continue;
        }

        const newTaggedUrl = this.taggedUrlRepository.create({
          tag_id: newTagId,
          url_id: url.id
        });
        const taggedUrl = await queryRunner.manager.save(TaggedUrl, newTaggedUrl);
        existedTags.push(taggedUrl);
      }

      url.tags = existedTags;
      url = await queryRunner.manager.save(Url, url);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException("Failed when updating url");
    } finally {
      await queryRunner.release();
      url.tags = url.tags.filter((tag) => tag.url_id);
      return url;
    }
  }

  async deleteUrl(currentUser: User, urlId: string) {
    const url = await this.urlRepository.findOne({
      where: {
        id: urlId,
      },
      relations: ["owner"],
    });
    if (!url) {
      throw new NotFoundException("Url not found");
    }
    if (url.owner.id !== currentUser.id) {
      throw new BadRequestException("You don't have permission to delete this url");
    }

    return await this.urlRepository.remove(url);
  }

  async exportCsv(currentUser: User, urlsId: string[]) {
    const urls = await this.urlRepository
      .createQueryBuilder("urls")
      .leftJoinAndSelect("urls.owner", "owner")
      .where("urls.id IN (:...urlsId)", { urlsId })
      .andWhere("urls.owner = :ownerId", { ownerId: currentUser.id })
      .orderBy("urls.id", "DESC")
      .getMany();
    
    // Decrypt password before exporting csv
    for (const url of urls) {
      if (url.password) {
        url.password = CryptoJS.AES.decrypt(url.password, this.ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
      }
    }

    const csvFileName = `urls-${currentUser.username}-${new Date().getTime()}.csv`;
    const csvFilePath = await this.csvService.writeUrlsCsv(csvFileName, urls);

    return csvFilePath;
  }

  async saveRefLinks(user: User, refLinksId: string[]) {
    for (const refLinkId of refLinksId) {
      const refLink = await this.urlRepository.findOne({
        where: {
          id: refLinkId
        }
      })

      if (refLink) {
        refLink.owner = user;
      }
      await this.urlRepository.save(refLink);
    }
  }

  /** Bulk update active/inactive urls */
  async setStatusUrls(currentUser: User, urlsId: string[], active: boolean) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const urlId of urlsId) {
        const url = await this.urlRepository.findOne({
          where: {
            id: urlId,
            owner: {
              id: currentUser.id
            }
          },
        });
        if (!url) { 
          throw new Error("Url not found");
        }

        url.is_active = active;
        await queryRunner.manager.save(url);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message || `Failed when bulk ${active ? "active" : "inactive"} urls`);
    } finally {
      await queryRunner.release();
    }
  }

  /** Bulk set/remove tag for urls */
  async setTagUrls(currentUser: User, bulkSetTagUrlsDto: BulkSetTagUrlsDto) {
    const { 
      ids: urlsId, 
      tag_id: tagId, 
      add_tag: addTag 
    } = bulkSetTagUrlsDto;

    const existedTag = await this.tagsService.findTag(currentUser, tagId);
    if (!existedTag) {
      throw new NotFoundException("Tag not found");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const urlId of urlsId) {
        const existedUrl = await this.urlRepository.findOne({
          where: {
            id: urlId,
            owner: {
              id: currentUser.id
            }
          },
          relations: ["tags"],
        });
        
        if (!existedUrl) { 
          throw new Error("Url not found");
        }

        if (addTag && !existedUrl.tags.find(t => t.tag_id == tagId)) {
          const newTaggedUrl = this.taggedUrlRepository.create({
            tag_id: tagId,
            url_id: urlId
          });
          await queryRunner.manager.save(newTaggedUrl);
        } else if (!addTag && existedUrl.tags.find(t => t.tag_id == tagId)) {
          await queryRunner.manager.delete(TaggedUrl, { 
            url_id: urlId, 
            tag_id: tagId
          });
        }
      }

      await queryRunner.commitTransaction();

      // Find and return updated urls
      const updatedUrls = await this.urlRepository.find({
        where: {
          id: In(urlsId),
          owner: {
            id: currentUser.id
          }
        },
        relations: ["tags"],
      });
      return updatedUrls;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error.message || "Failed when bulk set tag urls");
    } finally {
      await queryRunner.release();
    }
  }

  private checkBackHalf(backHalf: string) {
    return this.urlRepository.findOneBy({ back_half: backHalf });
  }

  private async generateBackHalf() {
    let backHalf = uuidiv4().split("-")[0];
    while (true) {
      // Check if backHalf is existed
      if (!await this.checkBackHalf(backHalf)) {
        return backHalf;
      }
    }
  }
}
