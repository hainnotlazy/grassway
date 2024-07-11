import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand, BrandMember, Url, User } from '../models';
import { CreateBrandDto, ShortenUrlDto, UpdateQrCodeSettingsDto } from '../dtos';
import { BehaviorSubject, filter, map } from 'rxjs';
import { GetUrlsOptions, UrlsResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly CREATE_BRAND_FIELDS = [
    "title", "description", "prefix", "logo", "facebook", "instagram", "x",
    "youtube", "tiktok", "linkedin", "discord", "github", "website", "invited_users"
  ];

  /**
   * List of brands
  */
  private readonly brandsSubject = new BehaviorSubject<Brand[]>([]);
  brands$ = this.brandsSubject.asObservable();
  setBrands(brands: Brand[]) {
    this.brandsSubject.next(brands);
  }

  /**
   * Current brand for managing
   */
  private readonly currentBrandSubject = new BehaviorSubject<Brand | null>(null);
  currentBrand$ = this.currentBrandSubject.asObservable().pipe(
    filter(brand => !!brand),
    map(brand => brand as Brand)
  );
  setCurrentBrand(brand: Brand | null) {
    this.currentBrandSubject.next(brand);
  }

  constructor(
    private httpClient: HttpClient,
  ) { }

  /**
   * Describe: Get all brands
  */
  getBrands() {
    return this.httpClient.get<Brand[]>("api/brands");
  }

  /**
   * Describe: Get brand by id
  */
  getBrandById(brandId: string) {
    return this.httpClient.get<Brand>(`api/brands/${brandId}`);
  }

  /**
   * Describe: Get brand by prefix
  */
  getBrandByPrefix(prefix: string) {
    return this.httpClient.get<Brand>(`api/brands/prefix/${prefix}`);
  }

  /**
   * Describe: Get brand links
  */
  getBrandLinks(brandId: string, options: GetUrlsOptions) {
    const {
      page = 1,
      search = "",
    } = options;

    return this.httpClient.get<UrlsResponse>(`api/brands/${brandId}/urls?page=${page}&search=${search}`);
  }

  /**
   * Describe: Get filtered brand links
  */
  getFilteredBrandLinks(brandId: string, query: string) {
    return this.httpClient.get<Url[]>(`api/brands/${brandId}/urls/filter?query=${query}`);
  }

  /**
   * Describe: Get brand members
  */
  getBrandMembers(brandId: string) {
    return this.httpClient.get<BrandMember[]>(`api/brands/${brandId}/members`);
  }

  /**
   * Describe: Get role
  */
  getRole(brandId: string) {
    return this.httpClient.get<BrandMember>(`api/brands/${brandId}/role`);
  }

  /**
   * Describe: Validate brand prefix
  */
  validateBrandPrefix(prefix: string) {
    return this.httpClient.get<boolean>(`api/brands/validate-prefix?prefix=${prefix}`);
  }

  /**
   * Describe: Create brand
  */
  createBrand(createBrandDto: CreateBrandDto) {
    const formData = new FormData();

    for (const field of this.CREATE_BRAND_FIELDS) {
      if (field === "invited_users") {
        for (let user of createBrandDto.invited_users) {
          formData.append("invited_users[]", user.toString());
        }
        continue;
      }

      if (createBrandDto[field]) {
        formData.append(field, createBrandDto[field]);
      }
    }

    return this.httpClient.post<Brand>("api/brands", formData);
  }

  /**
   * Describe: Send invitation
  */
  sendInvitation(brandId: string, invitedUsersId: number[]) {
    return this.httpClient.post<BrandMember[]>(`api/brands/${brandId}/members/send-invitation`, {
      ids: invitedUsersId
    });
  }

  /**
   * Describe: Create link
  */
  createLink(brandId: string, createLinkDto: ShortenUrlDto) {
    return this.httpClient.post<Url>(`api/brands/${brandId}/urls`, createLinkDto);
  }

  /**
   * Describe: Update QR Code settings
  */
  updateQrCodeSettings(brandId: string, updateQrCodeSettingsDto: UpdateQrCodeSettingsDto) {
    return this.httpClient.put<Brand>(`api/brands/${brandId}/qr-code`, updateQrCodeSettingsDto);
  }

  /**
   * Describe: Transfer ownership
  */
  transferOwnership(brandId: string, memberId: number) {
    return this.httpClient.put<void>(`api/brands/${brandId}/members/${memberId}/transfer-ownership`, null);
  }

  /**
   * Describe: Publish changes
  */
  publishChanges(brandId: string) {
    return this.httpClient.put<void>(`api/brands/${brandId}/publish-changes`, null);
  }

  /**
   * Describe: Delete brand
  */
  deleteBrand(brandId: string) {
    return this.httpClient.delete<void>(`api/brands/${brandId}`);
  }

  /**
   * Describe: Remove link
  */
  removeBrandLink(brandId: string, urlId: number) {
    return this.httpClient.delete(`api/brands/${brandId}/urls/${urlId}`);
  }

  /**
   * Describe: Remove member
  */
  removeMember(brandId: string, memberId: number) {
    return this.httpClient.delete<void>(`api/brands/${brandId}/members/${memberId}`);
  }
}
