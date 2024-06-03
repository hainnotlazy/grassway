import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-paginate';
import { GetUrlsOptions, LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidiv4 } from "uuid";
import * as CryptoJS from 'crypto-js';
import { CsvService } from 'src/shared/services/csv/csv.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlsService {
  private readonly ENCRYPTION_SECRET = this.configService.get("ENCRYPTION_SECRET");

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    private dataSource: DataSource,
    private csvService: CsvService,
    private configService: ConfigService
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
    const { limit, page, isActive, linkTypeOptions, startDate, endDate  } = options;

    // Create query builder
    const queryBuilder = this.urlRepository.createQueryBuilder("urls")
      .leftJoinAndSelect("urls.owner", "owner")
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

    return paginate({
      limit,
      page,
      path: "/api/urls",
      select: [
        "id",
        "origin_url",
        "back_half",
        "shortened_url",
        "is_active"
      ],
      sortBy: [
        ["id", "DESC"]
      ]
    }, queryBuilder, {
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

  async updateUrl(currentUser: User, urlId: string, updateUrl: Partial<Url>) {
    const url = await this.urlRepository.findOne({
      where: {
        id: urlId,
        owner: {
          id: currentUser.id
        }
      }
    });

    if (!url) {
      throw new NotFoundException("Url not found");
    }

    if (updateUrl.password) {
      updateUrl.password = CryptoJS.AES.encrypt(updateUrl.password, this.ENCRYPTION_SECRET).toString();
      updateUrl.use_password = true;
    } else {
      updateUrl.use_password = false;
    }

    Object.assign(url, updateUrl);
    return this.urlRepository.save(url);
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
