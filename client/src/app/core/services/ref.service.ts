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

  /**
   * Describe: Save ref link into 'Local Storage'
  */
  insertRefLink(linkId: number) {
    const refLinks = this.getRefLinks();
    refLinks.push(linkId);
    this.saveRefLinks(refLinks);
  }

  /**
   * Describe: Perform action to save ref link into 'Local Storage'
  */
  saveRefLinks(links: number[]) {
    localStorage.setItem("ref_links", JSON.stringify(links));
  }

  /**
   * Describe: Get ref links from 'Local Storage'
  */
  getRefLinks(): number[] {
    return JSON.parse(localStorage.getItem("ref_links") || "[]");
  }

  /**
   * Describe: Clear all ref links from 'Local Storage'
  */
  removeRefLinks() {
    localStorage.removeItem("ref_links");
  }
}
