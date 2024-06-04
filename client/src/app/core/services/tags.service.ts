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

  getTags() {
    return this.httpClient.get<Tag[]>("api/tags");
  }

  createTag(name: string, icon: string, description: string) {
    return this.httpClient.post<Tag>("api/tags", {
      name,
      icon,
      description
    });
  }

  updateTag(id: number, name: string, icon: string, description: string) {
    return this.httpClient.put<Tag>(`api/tags/${id}`, {
      name,
      icon,
      description
    })
  }

  deleteTag(id: number) {
    return this.httpClient.delete(`api/tags/${id}`);
  }
}
