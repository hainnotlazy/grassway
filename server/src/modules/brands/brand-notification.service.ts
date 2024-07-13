import { Injectable } from "@nestjs/common";
import { NotificationService } from "../notification/notification.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Brand, BrandMember, BrandMemberRole, NotificationType, User } from "src/entities";
import { Repository } from "typeorm";

@Injectable()
export class BrandNotificationService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(BrandMember)
    private readonly brandMemberRepository: Repository<BrandMember>,
    private readonly notificationService: NotificationService
  ) {}

  /**
   * Describe: Send notification to owner when brand is created
  */
  async sendCreatedBrandEvent(brand: Brand): Promise<void> {
    const owner = await this.brandMemberRepository.findOne({
      where: {
        brand_id: brand.id,
        role: BrandMemberRole.OWNER
      },
      relations: ["user"]
    });

    await this.notificationService.createNewNotification(
      owner.user, 
      {
        title: `Brand is now on air`,
        description: `Brand ${brand.title} (${brand.prefix}) was created successfully!`,
        type: NotificationType.BRAND_CREATED
      },
      true
    );
  }

  /**
   * Describe: Send notification to user when user is invited to join brand
  */
  async sendInvitationEvent(brand: Brand, invitedUser: User) {
    await this.notificationService.createNewNotification(
      invitedUser, 
      {
        title: `Brand Invitation`,
        description: `You have been invited to join brand ${brand.title} (${brand.prefix})`,
        type: NotificationType.BRAND_INVITATION
      },
      true
    );
  }

  /**
   * Describe: Send notification to owner when invited user accepted to join brand
  */
  async sendMemberJoinedEvent(brand: Brand, newMember: User) {
    const owner = await this.brandMemberRepository.findOne({
      where: {
        brand_id: brand.id,
        role: BrandMemberRole.OWNER
      },
      relations: ["user"]
    });

    await this.notificationService.createNewNotification(
      owner.user, 
      {
        title: `New member`,
        description: `Member ${newMember.fullname} has joined brand ${brand.title} (${brand.prefix})`,
        type: NotificationType.BRAND_MEMBER_JOINED
      },
      true
    );
  }

  /**
   * Describe: Send notification to owner when user left the brand
  */
  async sendMemberLeftEvent(brand: Brand, departedMember: User) {
    const owner = await this.brandMemberRepository.findOne({
      where: {
        brand_id: brand.id,
        role: BrandMemberRole.OWNER
      },
      relations: ["user"]
    });
    
    await this.notificationService.createNewNotification(
      owner.user, 
      {
        title: `Member left`,
        description: `Member ${departedMember.fullname} has left brand ${brand.title} (${brand.prefix})`,
        type: NotificationType.BRAND_MEMBER_LEFT
      },
      true
    );
  }

  /**
   * Describe: Send notification to user when brand is deleted
  */
  async sendDestroyBrandEvent(brand: Brand, destinationUser: User) {
    await this.notificationService.createNewNotification(
      destinationUser, 
      {
        title: `Brand was deleted`,
        description: `Brand ${brand.title} (${brand.prefix}) was deleted by its owner!`,
        type: NotificationType.BRAND_DESTROYED
      },
      true
    );
  }
}