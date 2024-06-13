import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'full-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss']
})
export class FullLayout {
  showScrollToTop = false;
  positionShowScrollToTop = 300;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (scrollPosition >= this.positionShowScrollToTop) {
      this.showScrollToTop = true;
    } else {
      this.showScrollToTop = false;
    }
  }

  onScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
