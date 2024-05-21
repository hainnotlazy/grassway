import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, paginate } from 'nestjs-paginate';
import { GetUrlsOptions, LinkTypeOptions } from 'src/common/models/get-urls-options.model';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidiv4 } from "uuid";

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  /** Describe: Get paginated urls by user */
  async getUrls(currentUser: User, options: GetUrlsOptions) {
    const { limit, page, isActive, linkTypeOptions, endDate, startDate } = options;

    // Create query builder
    const queryBuilder = this.urlRepository.createQueryBuilder("urls")
      .leftJoinAndSelect("urls.owner", "owner")
      .where("urls.owner = :ownerId", { ownerId: currentUser.id })
      .andWhere("urls.is_active = :isActive", { isActive })
    
    if (linkTypeOptions === LinkTypeOptions.WITH_CUSTOM_BACK_HALVES) {
      queryBuilder.andWhere("urls.custom_back_half != ''");
    } else if (linkTypeOptions === LinkTypeOptions.WITHOUT_CUSTOM_BACK_HALVES) {
      queryBuilder.andWhere("urls.custom_back_half is null"); // = null
    }

      // .andWhere("urls.created_at > :startDate", { startDate: new Date(Date.now() - 24 * 60 * 60 * 1000) })
      // .andWhere("urls.created_at < :endDate", { endDate: new Date() })
    
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
    // TODO: add http/https to origin url if origin_url is youtube.com
    const { origin_url, title, description, custom_back_half, password } = url;

    const backHalf = await this.generateBackHalf();

    const shortenedUrl = this.urlRepository.create({ 
      origin_url, 
      owner: currentUser,
      back_half: backHalf ,
      title,
      description,
      custom_back_half,
      password
    });

    return this.urlRepository.save(shortenedUrl);
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
