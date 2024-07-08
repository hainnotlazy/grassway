import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrandsSocket } from '../sockets';
import { BlockType, BrandBlockDraft, BrandDraft } from '../models';
import { BrandBlockDto, UpdateBrandDesignDto, UpdateSocialPlatformsDto, UpdateSocialPlatformsOrderDto } from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class BrandsDraftService {
  private readonly DRAFT_CHANGED_EVENT_NAME = "DraftChanged";

  constructor(
    private httpClient: HttpClient,
    private socket: BrandsSocket
  ) { }

  watchDraftChanged() {
    return this.socket.fromEvent<BrandDraft>(this.DRAFT_CHANGED_EVENT_NAME);
  }

  getBrandByPrefix(prefix: string) {
    return this.httpClient.get<BrandDraft>(`api/brands/draft/prefix/${prefix}`);
  }

  getDesign(brandId: string) {
    return this.httpClient.get<BrandDraft>(`api/brands/draft/${brandId}/design`);
  }

  updateDesign(brandId: string, updateBrandDesignDto: UpdateBrandDesignDto) {
    const fields = Object.keys(updateBrandDesignDto);

    const formData = new FormData();
    for (const field of fields) {
      // @ts-ignore
      const fieldValue = updateBrandDesignDto[field];
      if (fieldValue) {
        formData.append(field, fieldValue);
      }
    }

    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/design`,
      formData
    );
  }

  updateSocialPlatforms(
    brandId: string,
    updateSocialPlatformsDto: UpdateSocialPlatformsDto
  ) {
    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/social-platforms`,
      updateSocialPlatformsDto
    );
  }

  updateSocialPlatformsOrder(
    brandId: string,
    updateSocialPlatformsOrderDto: UpdateSocialPlatformsOrderDto
  ) {
    return this.httpClient.put<BrandDraft>(
      `api/brands/draft/${brandId}/social-platforms/order`,
      updateSocialPlatformsOrderDto
    );
  }

  getBlocks(brandId: string) {
    return this.httpClient.get<BrandBlockDraft[]>(`api/brands/draft/${brandId}/blocks`);
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

    return this.httpClient.post<BrandBlockDraft>(
      `api/brands/draft/${brandId}/blocks`,
      formData
    );
  }

  updateBlock(
    brandId: string,
    blockId: number,
    updateBlockDto: BrandBlockDto
  ) {
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

    return this.httpClient.put<BrandBlockDraft>(
      `api/brands/draft/${brandId}/blocks/${blockId}`,
      formData
    );
  }

  updateBlocksOrder(brandId: string, updateBlocksOrderDto: number[]) {
    return this.httpClient.put<void>(
      `api/brands/draft/${brandId}/blocks/order`,
      {
        ids: updateBlocksOrderDto
      }
    );
  }

  removeBlock(brandId: string, blockId: number) {
    return this.httpClient.delete(`api/brands/draft/${brandId}/blocks/${blockId}`);
  }
}
