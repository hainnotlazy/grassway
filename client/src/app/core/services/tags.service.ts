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

  createTag(name: string, icon: string, description: string) {
    return this.httpClient.post<Tag>("api/tags", {
      name,
      icon,
      description
    })
  }
}
