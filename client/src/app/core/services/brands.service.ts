import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Brand, BrandDraft } from '../models';
import { BrandsSocket } from '../sockets';
import { CreateBrandDto, UpdateBrandDesignDto, UpdateSocialPlatformsOrderDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly NEW_DESIGN_EVENT_NAME = "NewDesign";
  private readonly CREATE_BRAND_FIELDS = [
    "title", "description", "prefix", "logo", "facebook", "instagram", "twitter",
    "youtube", "tiktok", "linkedin", "discord", "github", "website", "invited_users"
  ];

  constructor(
    private httpClient: HttpClient,
    private socket: BrandsSocket
  ) { }

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
    return this.httpClient.put<BrandDraft>(`api/brands/draft/${brandId}/design`, updateBrandDesignDto);
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

  updateSocialPlatformsDraft(brandId: string, updateBrandSocialPlatformsDto: any) {
  }
}
