import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PersonalLinksAnalytics, PublicLinksAnalytics } from 'src/common/models/analytics-response.model';
import { User, Url, UrlAnalytics } from 'src/entities';
import { RedisDatabase, RedisService } from 'src/shared/services/redis/redis.service';
import { Not, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(UrlAnalytics)
    private readonly urlAnalyticsRepository: Repository<UrlAnalytics>,
    private readonly redisService: RedisService
  ) {}

  /** 
   * Describe: Get new public analytics if cached data was expired 
   * @Cached Data will be cached for TTL 15mins
  */
  async getPublicAnalytics(): Promise<PublicLinksAnalytics> {
    const [cachedTotalLinks, cachedTotalCustomBackHalf, cachedTotalVisited] = await Promise.all([
      this.redisService.getKey({
        key: "public_analytics_total_links",
        database: RedisDatabase.PUBLIC_ANALYTICS
      }),
      this.redisService.getKey({
        key: "public_analytics_total_custom_back_half",
        database: RedisDatabase.PUBLIC_ANALYTICS
      }),
      this.redisService.getKey({
        key: "public_analytics_total_visited",
        database: RedisDatabase.PUBLIC_ANALYTICS
      })
    ]);

    if (!cachedTotalCustomBackHalf || !cachedTotalLinks || !cachedTotalVisited) {
      return await this.handleGetPublicAnalytics();
    }

    return {
      totalLinks: this.parseValueIntoNumber(cachedTotalLinks),
      totalCustomBackHalf: this.parseValueIntoNumber(cachedTotalCustomBackHalf),
      totalVisited: this.parseValueIntoNumber(cachedTotalVisited)
    }
  }

  /**
   * Describe: Get new public analytics then save it in redis
  */
  private async handleGetPublicAnalytics(): Promise<PublicLinksAnalytics> {
    const [totalLinks, totalCustomBackHalfLinks, totalVisited] = await Promise.all([
      this.getTotalLinks(),
      this.getTotalCustomBackHalfLinks(),
      this.getTotalVisited()
    ]);

    // Cache data 
    const setKeyOptions = {
      database: RedisDatabase.PUBLIC_ANALYTICS,
      expiresIn: 15 * 60
    }
    await Promise.all([
      this.redisService.setKey({
        key: "public_analytics_total_links",
        value: totalLinks ? totalLinks.toString() : "0",
        ...setKeyOptions
      }),
      this.redisService.setKey({
        key: "public_analytics_total_custom_back_half",
        value: totalCustomBackHalfLinks ? totalCustomBackHalfLinks.toString() : "0",
        ...setKeyOptions
      }),
      this.redisService.setKey({
        key: "public_analytics_total_visited",
        value: totalVisited ? totalVisited.toString() : "0",
        ...setKeyOptions
      })
    ]);

    return {
      totalLinks: this.parseValueIntoNumber(totalLinks),
      totalCustomBackHalf: this.parseValueIntoNumber(totalCustomBackHalfLinks),
      totalVisited: this.parseValueIntoNumber(totalVisited)
    }
  }

  /**  
   * Describe: Get personal analytics
  */
  async getAnalytics(currentUser: User): Promise<PersonalLinksAnalytics> {
    const [
      // Get total visited & redirected success
      totalVisited,
      totalRedirectedSuccess,
      // Get total clicks by devices
      [
        totalClicksByDesktop, 
        totalClicksByTablet, 
        totalClicksByMobile
      ],
      // Get total active & inactive links
      totalActiveLinks,
      totalInactiveLinks,
      // Get total referrers
      totalReferrers
    ] = await Promise.all([
      this.getTotalVisited(currentUser.id),
      this.getTotalRedirectedSuccess(currentUser.id),
      this.getVisitedByDevices(currentUser.id),
      this.getTotalActiveLinks(currentUser.id),
      this.getTotalInactiveLinks(currentUser.id),
      this.getReferrersStatics(currentUser.id)
    ]);

    return {
      totalVisited: this.parseValueIntoNumber(totalVisited),
      totalRedirectedSuccess: this.parseValueIntoNumber(totalRedirectedSuccess),
      totalClicksByDesktop: this.parseValueIntoNumber(totalClicksByDesktop),
      totalClicksByTablet: this.parseValueIntoNumber(totalClicksByTablet),
      totalClicksByMobile: this.parseValueIntoNumber(totalClicksByMobile),
      totalActiveLinks: this.parseValueIntoNumber(totalActiveLinks),
      totalInactiveLinks: this.parseValueIntoNumber(totalInactiveLinks),
      totalReferrers
    }
  }

  /**
   * Describe: Get brand analytics
  */
  async getBrandAnalytics(currentUser: User, brandId: string) {
    const [
      // Get total visited & redirected success
      totalVisited,
      totalRedirectedSuccess,
      // Get total clicks by devices
      [
        totalClicksByDesktop, 
        totalClicksByTablet, 
        totalClicksByMobile
      ],
      // Get total active & inactive links
      totalActiveLinks,
      totalInactiveLinks,
      // Get total referrers
      totalReferrers
    ] = await Promise.all([
      this.getTotalVisited(currentUser.id, brandId),
      this.getTotalRedirectedSuccess(currentUser.id, brandId),
      this.getVisitedByDevices(currentUser.id, brandId),
      this.getTotalActiveLinks(currentUser.id, brandId),
      this.getTotalInactiveLinks(currentUser.id, brandId),
      this.getReferrersStatics(currentUser.id, brandId)
    ]);

    return {
      totalVisited: this.parseValueIntoNumber(totalVisited),
      totalRedirectedSuccess: this.parseValueIntoNumber(totalRedirectedSuccess),
      totalClicksByDesktop: this.parseValueIntoNumber(totalClicksByDesktop),
      totalClicksByTablet: this.parseValueIntoNumber(totalClicksByTablet),
      totalClicksByMobile: this.parseValueIntoNumber(totalClicksByMobile),
      totalActiveLinks: this.parseValueIntoNumber(totalActiveLinks),
      totalInactiveLinks: this.parseValueIntoNumber(totalInactiveLinks),
      totalReferrers
    }
  }

  /**
   * Describe: Get total links
  */
  private async getTotalLinks() {
    const latestLink = await this.urlRepository.findOne({
      where: {},
      order: {
        id: 'DESC'
      }
    });

    if (latestLink) return latestLink.id;
    
    return 0;
  }

  /** 
   * Describe: Get total visited
  */
  private async getTotalVisited();
  private async getTotalVisited(userId: number);
  private async getTotalVisited(userId: number, brandId: string);
  private async getTotalVisited(userId?: number, brandId?: string) {
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return 0;
      }

      return (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .select("sum(url_analytics.visited_by_desktop + url_analytics.visited_by_tablet + url_analytics.visited_by_mobile)", "total")
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getRawMany()
      )[0].total;
    } else if (!userId) {  
      return (await this.urlAnalyticsRepository
        .createQueryBuilder("url_analytics")
        .select("sum(url_analytics.visited_by_desktop + url_analytics.visited_by_tablet + url_analytics.visited_by_mobile)", "total")
        .getRawMany()
      )[0].total;
    } else {
      return (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.visited_by_desktop + url_analytics.visited_by_tablet + url_analytics.visited_by_mobile)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany()
      )[0].total;
    }
  }

  /** 
   * Describe: Get total redirected success
  */
  private async getTotalRedirectedSuccess(userId: number);
  private async getTotalRedirectedSuccess(userId: number, brandId: string);
  private async getTotalRedirectedSuccess(userId: number, brandId?: string) {
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return 0;
      }

      return (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .select("sum(url_analytics.redirect_success)", "total")
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getRawMany()
      )[0].total;
    } else if (userId) {
      return (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.redirect_success)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany()
      )[0].total;
    }
  }

  /** 
   * Describe: Get total clicks by devices
  */
  private async getVisitedByDevices(userId: number);
  private async getVisitedByDevices(userId: number, brandId: string);
  private async getVisitedByDevices(userId: number, brandId?: string) {
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return [0, 0, 0];
      }

      const statics = await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .select([
          "sum(url_analytics.visited_by_desktop) as total_desktop",
          "sum(url_analytics.visited_by_tablet) as total_tablet",
          "sum(url_analytics.visited_by_mobile) as total_mobile"
        ])
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getRawMany();
  
      return [
        this.parseValueIntoNumber(statics[0].total_desktop),
        this.parseValueIntoNumber(statics[0].total_tablet),
        this.parseValueIntoNumber(statics[0].total_mobile)
      ];
    } else if (userId) {
      const statics = await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select([
          "sum(url_analytics.visited_by_desktop) as total_desktop",
          "sum(url_analytics.visited_by_tablet) as total_tablet",
          "sum(url_analytics.visited_by_mobile) as total_mobile"
        ])
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany();
  
      return [
        this.parseValueIntoNumber(statics[0].total_desktop),
        this.parseValueIntoNumber(statics[0].total_tablet),
        this.parseValueIntoNumber(statics[0].total_mobile)
      ];
    }
  }

  /** 
   * Describe: Get total active links
  */
  private async getTotalActiveLinks(userId: number);
  private async getTotalActiveLinks(userId: number, brandId: string);
  private async getTotalActiveLinks(userId: number, brandId?: string) {
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return 0;
      }

      return await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("url.is_active = :is_active", { is_active: true })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getCount();
    } else if (userId) {
      return await this.urlRepository
        .createQueryBuilder("url")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .andWhere("url.is_active = :is_active", { is_active: true })
        .getCount();
    }
  }

  /**   
   * Describe: Get total inactive links
  */
  private async getTotalInactiveLinks(userId: number);
  private async getTotalInactiveLinks(userId: number, brandId: string);
  private async getTotalInactiveLinks(userId: number, brandId?: string) {
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return 0;
      }

      return await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("url.is_active = :is_active", { is_active: false })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getCount();
    } else if (userId) {
      return await this.urlRepository
        .createQueryBuilder("url")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .andWhere("url.is_active = :is_active", { is_active: false })
        .getCount();
    }
  }

  /**   
   * Describe: Get total custom-back-half links
  */
  private async getTotalCustomBackHalfLinks();
  private async getTotalCustomBackHalfLinks(userId: number);
  private async getTotalCustomBackHalfLinks(userId?: number) {
    if (!userId) {
      return await this.urlRepository.count({
        where: {
          custom_back_half: Not("")
        }
      });
    } else {
      return await this.urlRepository.count({
        where: {
          owner: {
            id: userId
          },
          custom_back_half: Not("")
        }
      });
    }
  }

  /**   
   * Describe: Get total not custom-back-half links
  */
  private async getTotalDefaultBackHalfLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.custom_back_half is null")
      .getCount();
  }

  /**
   * Describe: Get referrers statics
  */
  private async getReferrersStatics(userId: number);
  private async getReferrersStatics(userId: number, brandId: string);
  private async getReferrersStatics(userId: number, brandId?: string) {
    let totalReferrers = {
      google: 0,
      facebook: 0,
      instagram: 0,
      youtube: 0,
      reddit: 0,
      twitter: 0,
      linkedin: 0,
      unknown: 0
    };
    if (userId && brandId) {
      if (!isUUID(brandId)) {
        return totalReferrers;  
      }
      
      const statics = await this.urlAnalyticsRepository.createQueryBuilder("url_analytics")
        .leftJoinAndSelect("url_analytics.url", "url")
        .leftJoinAndSelect("url.brand", "brand")
        .leftJoinAndSelect("brand.members", "brand_members")
        .select([
          "sum(url_analytics.referrer_from_google) as total_referrer_from_google",
          "sum(url_analytics.referrer_from_facebook) as total_referrer_from_facebook",
          "sum(url_analytics.referrer_from_instagram) as total_referrer_from_instagram",
          "sum(url_analytics.referrer_from_youtube) as total_referrer_from_youtube",
          "sum(url_analytics.referrer_from_reddit) as total_referrer_from_reddit",
          "sum(url_analytics.referrer_from_twitter) as total_referrer_from_twitter",
          "sum(url_analytics.referrer_from_linkedin) as total_referrer_from_linkedin",
          "sum(url_analytics.referrer_from_unknown) as total_referrer_from_unknown"
        ])
        .where("url.brand_id = :brandId", { brandId })
        .andWhere("url.owner_id = :userId", { userId })
        .andWhere("brand_members.user_id = :userId", { userId })
        .getRawMany();
      
      totalReferrers = {
        google: this.parseValueIntoNumber(statics[0].total_referrer_from_google),
        facebook: this.parseValueIntoNumber(statics[0].total_referrer_from_facebook),
        instagram: this.parseValueIntoNumber(statics[0].total_referrer_from_instagram),
        youtube: this.parseValueIntoNumber(statics[0].total_referrer_from_youtube),
        reddit: this.parseValueIntoNumber(statics[0].total_referrer_from_reddit),
        twitter: this.parseValueIntoNumber(statics[0].total_referrer_from_twitter),
        linkedin: this.parseValueIntoNumber(statics[0].total_referrer_from_linkedin),
        unknown: this.parseValueIntoNumber(statics[0].total_referrer_from_unknown)
      };
    } else if (userId) {
      const statics = await this.urlAnalyticsRepository.createQueryBuilder("url_analytics")
        .leftJoinAndSelect("url_analytics.url", "url")
        .select([
          "sum(url_analytics.referrer_from_google) as total_referrer_from_google",
          "sum(url_analytics.referrer_from_facebook) as total_referrer_from_facebook",
          "sum(url_analytics.referrer_from_instagram) as total_referrer_from_instagram",
          "sum(url_analytics.referrer_from_youtube) as total_referrer_from_youtube",
          "sum(url_analytics.referrer_from_reddit) as total_referrer_from_reddit",
          "sum(url_analytics.referrer_from_twitter) as total_referrer_from_twitter",
          "sum(url_analytics.referrer_from_linkedin) as total_referrer_from_linkedin",
          "sum(url_analytics.referrer_from_unknown) as total_referrer_from_unknown"
        ])
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany();
      
      totalReferrers = {
        google: this.parseValueIntoNumber(statics[0].total_referrer_from_google),
        facebook: this.parseValueIntoNumber(statics[0].total_referrer_from_facebook),
        instagram: this.parseValueIntoNumber(statics[0].total_referrer_from_instagram),
        youtube: this.parseValueIntoNumber(statics[0].total_referrer_from_youtube),
        reddit: this.parseValueIntoNumber(statics[0].total_referrer_from_reddit),
        twitter: this.parseValueIntoNumber(statics[0].total_referrer_from_twitter),
        linkedin: this.parseValueIntoNumber(statics[0].total_referrer_from_linkedin),
        unknown: this.parseValueIntoNumber(statics[0].total_referrer_from_unknown)
      };
    }

    return totalReferrers;
  }

  /**   
   * Describe: Parse value into number, if value is null return 0
  */
  private parseValueIntoNumber(value: string | number | null): number {
    if (typeof value === "number") {
      return value;
    }

    return !value ? 0 : parseInt(value);
  }
}
