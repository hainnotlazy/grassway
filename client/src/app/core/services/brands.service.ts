import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand, BrandBlockDraft, BrandDraft } from '../models';
import { BrandsSocket } from '../sockets';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto } from '../dtos';
import { BehaviorSubject, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly NEW_DESIGN_EVENT_NAME = "NewDesign";
  private readonly CREATE_BRAND_FIELDS = [
    "title", "description", "prefix", "logo", "facebook", "instagram", "x",
    "youtube", "tiktok", "linkedin", "discord", "github", "website", "invited_users"
  ];

  /**
   * Current brand for managing
   */
  private readonly currentBrandSubject = new BehaviorSubject<Brand | null>(null);
  currentBrand$ = this.currentBrandSubject.asObservable().pipe(
    filter(brand => !!brand),
    map(brand => brand as Brand)
  );

  constructor(
    private httpClient: HttpClient,
    private socket: BrandsSocket
  ) { }

  setCurrentBrand(brand: Brand | null) {
    this.currentBrandSubject.next(brand);
  }

  getBrands() {
    return this.httpClient.get<Brand[]>("api/brands");
  }

  getBrandById(brandId: string) {
    return this.httpClient.get<Brand>(`api/brands/${brandId}`);
  }

  getBrandByPrefix(prefix: string) {
    return this.httpClient.get<BrandDraft>(`api/brands/prefix/${prefix}`);
  }

  getBrandDraft(brandId: string) {
    // Add query as get draft data
    return this.httpClient.get<BrandDraft>(`api/brands/draft/${brandId}/design`);
  }

  getBrandBlocks(brandId: string) {
    return this.httpClient.get<BrandBlockDraft[]>(`api/brands/draft/${brandId}/blocks`);
  }

  getNewDesign() {
    return this.socket.fromEvent<BrandDraft>(this.NEW_DESIGN_EVENT_NAME);
  }

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

  validateBrandPrefix(prefix: string) {
    return this.httpClient.get<boolean>(`api/brands/validate-prefix?prefix=${prefix}`);
  }

  updateDesignDraft(brandId: string, updateBrandDesignDto: UpdateBrandDesignDto) {
    const fields = Object.keys(updateBrandDesignDto);

    const formData = new FormData();
    for (const field of fields) {
      // @ts-ignore
      const fieldValue = updateBrandDesignDto[field];
      if (fieldValue) {
        formData.append(field, fieldValue);
      }
    }

    return this.httpClient.put<BrandDraft>(`api/brands/draft/${brandId}/design`, formData);
  }

  updateSocialPlatformsDraftOrder(
    brandId: string,
    updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/social-platforms/order`,
      updateSocialPlatformsOrderDto
    );
  }

  updateSocialPlatformsDraft(
    brandId: string,
    updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/social-platforms`,
      updateSocialPlatformsDto
    );
  }
}
