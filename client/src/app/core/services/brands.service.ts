import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlockType, Brand, BrandBlockDraft, BrandDraft, Url } from '../models';
import { BrandsSocket } from '../sockets';
import { BrandBlockDto, CreateBrandDto, ShortenUrlDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto } from '../dtos';
import { BehaviorSubject, filter, map } from 'rxjs';
import { GetUrlsOptions, UrlsResponse } from '../interfaces';

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
   * List of brands
  */
  private readonly brandsSubject = new BehaviorSubject<Brand[]>([]);
  brands$ = this.brandsSubject.asObservable();

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

  setBrands(brands: Brand[]) {
    this.brandsSubject.next(brands);
  }

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

  getBrandLinks(brandId: string, options: GetUrlsOptions) {
    const {
      page = 1,
      search = "",
    } = options;

    return this.httpClient.get<UrlsResponse>(`api/brands/${brandId}/urls?page=${page}&search=${search}`);
  }

  getFilteredBrandLinks(brandId: string, query: string) {
    return this.httpClient.get<Url[]>(`api/brands/${brandId}/urls/filter?query=${query}`);
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

  createBlock(brandId: string, createBlockDto: BrandBlockDto) {
    const formData = new FormData();
    const formFields: string[] = ["type", "title", "description"];

    if (createBlockDto.type === BlockType.IMAGE) {
      formFields.push("image", "image_ratio");
    }
    if (createBlockDto.type === BlockType.YOUTUBE) {
      formFields.push("youtube_url");
    } else {
      createBlockDto.url && formFields.push("url");
      createBlockDto.url_id && formFields.push("url_id");
    }

    for (const field of formFields) {
      if (createBlockDto[field]) {
        formData.append(field, createBlockDto[field]);
      }
    }

    return this.httpClient.post<BrandBlockDraft>(`api/brands/draft/${brandId}/blocks`, formData);
  }

  createLink(brandId: string, createLinkDto: ShortenUrlDto) {
    return this.httpClient.post<Url>(`api/brands/${brandId}/urls`, createLinkDto);
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

  updateBlocksOrder(brandId: string, updateBlocksOrderDto: number[]) {
    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/blocks/order`, {
        ids: updateBlocksOrderDto
      }
    );
  }

  updateBlock(brandId: string, blockId: number, updateBlockDto: BrandBlockDto) {
    const formData = new FormData();
    const formFields: string[] = ["type", "title", "description"];

    if (updateBlockDto.type === BlockType.IMAGE) {
      formFields.push("image", "image_ratio");
    }
    if (updateBlockDto.type === BlockType.YOUTUBE) {
      formFields.push("youtube_url");
    } else {
      updateBlockDto.url && formFields.push("url");
      updateBlockDto.url_id && formFields.push("url_id");
    }

    for (const field of formFields) {
      if (updateBlockDto[field]) {
        formData.append(field, updateBlockDto[field]);
      }
    }

    return this.httpClient.put<BrandBlockDraft>(`api/brands/draft/${brandId}/blocks/${blockId}`, formData);
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

  removeBrandLink(brandId: string, urlId: number) {
    return this.httpClient.delete(`api/brands/${brandId}/urls/${urlId}`);
  }

  removeBrandBlock(brandId: string, blockId: number) {
    return this.httpClient.delete(`api/brands/draft/${brandId}/blocks/${blockId}`);
  }
}
