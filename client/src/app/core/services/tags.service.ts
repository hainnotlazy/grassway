import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Describe: Get all tags
  */
  getTags() {
    return this.httpClient.get<Tag[]>("api/tags");
  }

  /**
   * Describe: Create new tag
  */
  createTag(name: string, icon: string, description: string) {
    return this.httpClient.post<Tag>("api/tags", {
      name,
      icon,
      description
    });
  }

  /**
   * Describe: Update tag
  */
  updateTag(id: number, name: string, icon: string, description: string) {
    return this.httpClient.put<Tag>(`api/tags/${id}`, {
      name,
      icon,
      description
    })
  }

  /**
   * Describe: Delete tag
  */
  deleteTag(id: number) {
    return this.httpClient.delete(`api/tags/${id}`);
  }
}
