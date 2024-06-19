import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalLinksAnalytics, PublicLinksAnalytics } from 'src/common/models/analytics-response.model';
import { UrlAnalytics } from 'src/entities/url-analytics.entity';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { RedisDatabase, RedisService } from 'src/shared/services/redis/redis.service';
import { Not, Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
    @InjectRepository(UrlAnalytics)
    private readonly urlAnalyticsRepository: Repository<UrlAnalytics>,
    private redisService: RedisService
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
    const totalLinks = await this.getTotalLinks();
    const totalCustomBackHalfLinks = await this.getTotalCustomBackHalfLinks();
    const totalVisited = await this.getTotalVisited();

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
    // Get total visited & redirected success
    const totalVisited = await this.getTotalVisited(currentUser.id);
    const totalRedirectedSuccess = await this.getTotalRedirectedSuccess(currentUser.id);

    // Get total clicks by devices
    const [
      totalClicksByDesktop, 
      totalClicksByTablet, 
      totalClicksByMobile
    ] = await this.getVisitedByDevices(currentUser.id);

    // Get total active & inactive links
    const totalActiveLinks = await this.getTotalActiveLinks(currentUser.id);
    const totalInactiveLinks = await this.getTotalInactiveLinks(currentUser.id);

    // Get total custom-back-half & default-back-half links
    const totalCustomBackHalf = await this.getTotalCustomBackHalfLinks(currentUser.id);
    const totalDefaultBackHalf = await this.getTotalDefaultBackHalfLinks(currentUser.id);

    return {
      totalVisited: this.parseValueIntoNumber(totalVisited),
      totalRedirectedSuccess: this.parseValueIntoNumber(totalRedirectedSuccess),
      totalClicksByDesktop: this.parseValueIntoNumber(totalClicksByDesktop),
      totalClicksByTablet: this.parseValueIntoNumber(totalClicksByTablet),
      totalClicksByMobile: this.parseValueIntoNumber(totalClicksByMobile),
      totalActiveLinks: this.parseValueIntoNumber(totalActiveLinks),
      totalInactiveLinks: this.parseValueIntoNumber(totalInactiveLinks),
      totalCustomBackHalf: this.parseValueIntoNumber(totalCustomBackHalf),
      totalDefaultBackHalf: this.parseValueIntoNumber(totalDefaultBackHalf)
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
  private async getTotalVisited(userId?: number) {
    if (!userId) {  
      return (await this.urlAnalyticsRepository.createQueryBuilder("url_analytics")
        .select("sum(url_analytics.visited_by_desktop + url_analytics.visited_by_tablet + url_analytics.visited_by_mobile)", "total")
        .getRawMany()
      )[0].total;
    } else {
      return (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.visited_by_desktop + url_analytics.visited_by_tablet + url_analytics.visited_by_mobile)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total;
    }
  }

  /** 
   * Describe: Get total redirected success
  */
  private async getTotalRedirectedSuccess(userId: number) {
    return (await this.urlRepository
      .createQueryBuilder("url")
      .leftJoinAndSelect("url.analytics", "url_analytics")
      .select("sum(url_analytics.redirect_success)", "total")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .getRawMany())[0].total;
  }

  /** 
   * Describe: Get total clicks by devices
  */
  private async getVisitedByDevices(userId: number) {
    return [
      (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.visited_by_desktop)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total,
      (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.visited_by_tablet)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total,
      (await this.urlRepository
        .createQueryBuilder("url")
        .leftJoinAndSelect("url.analytics", "url_analytics")
        .select("sum(url_analytics.visited_by_mobile)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total
    ];
  }

  /** 
   * Describe: Get total active links
  */
  private async getTotalActiveLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.is_active = :is_active", { is_active: true })
      .getCount();
  }

  /**   
   * Describe: Get total inactive links
  */
  private async getTotalInactiveLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.is_active = :is_active", { is_active: false })
      .getCount();
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
   * Describe: Parse value into number, if value is null return 0
  */
  private parseValueIntoNumber(value: string | number | null): number {
    if (typeof value === "number") {
      return value;
    }

    return !value ? 0 : parseInt(value);
  }
}
