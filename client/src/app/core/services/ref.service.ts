import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RefService {
  /**
   * Describe:
   * - This service is used to save links in 'Local Storage' whenever user shorten new link (when not authenticated)
   * - These saved links will be only sent when user register a new account
   * - Whenever user authenticated by logging in, these saved links will be removed
  */
  constructor() {}

  insertRefLink(linkId: string) {
    const refLinks = this.getRefLinks();
    refLinks.push(linkId);
    this.saveRefLinks(refLinks);
  }

  saveRefLinks(links: string[]) {
    localStorage.setItem("ref_links", JSON.stringify(links));
  }

  getRefLinks(): string[] {
    return JSON.parse(localStorage.getItem("ref_links") || "[]");
  }

  removeRefLinks() {
    localStorage.removeItem("ref_links");
  }
}
