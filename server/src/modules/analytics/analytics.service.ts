import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalLinksAnalytics } from 'src/common/models/analytics-response.model';
import { Url } from 'src/entities/url.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>
  ) {}

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
      totalVisited: totalVisited || 0,
      totalRedirectedSuccess: totalRedirectedSuccess || 0,
      totalClicksByDesktop: totalClicksByDesktop || 0,
      totalClicksByTablet: totalClicksByTablet || 0,
      totalClicksByMobile: totalClicksByMobile || 0,
      totalActiveLinks: totalActiveLinks || 0,
      totalInactiveLinks: totalInactiveLinks || 0,
      totalCustomBackHalf: totalCustomBackHalf || 0,
      totalDefaultBackHalf: totalDefaultBackHalf || 0
    }
  }

  private async getTotalVisited(userId: number) {
    return (await this.urlRepository
      .createQueryBuilder("url")
      .select("sum(url.visited_by_desktop + url.visited_by_tablet + url.visited_by_mobile)", "total")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .getRawMany())[0].total;
  }

  private async getTotalRedirectedSuccess(userId: number) {
    return (await this.urlRepository
      .createQueryBuilder("url")
      .select("sum(url.redirect_success)", "total")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .getRawMany())[0].total;
  }

  private async getVisitedByDevices(userId: number) {
    return [
      (await this.urlRepository
        .createQueryBuilder("url")
        .select("sum(url.visited_by_desktop)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total,
      (await this.urlRepository
        .createQueryBuilder("url")
        .select("sum(url.visited_by_tablet)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total,
      (await this.urlRepository
        .createQueryBuilder("url")
        .select("sum(url.visited_by_mobile)", "total")
        .where("url.owner_id = :ownerId", { ownerId: userId })
        .getRawMany())[0].total
    ];
  }

  private async getTotalActiveLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.is_active = :is_active", { is_active: true })
      .getCount();
  }

  private async getTotalInactiveLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.is_active = :is_active", { is_active: false })
      .getCount();
  }

  private async getTotalCustomBackHalfLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.custom_back_half is not null")
      .getCount();
  }

  private async getTotalDefaultBackHalfLinks(userId: number) {
    return await this.urlRepository
      .createQueryBuilder("url")
      .where("url.owner_id = :ownerId", { ownerId: userId })
      .andWhere("url.custom_back_half is null")
      .getCount();
  }
}
