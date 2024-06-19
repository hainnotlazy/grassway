import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    class: "select-none"
  }
})
export class SidebarComponent {
  isInitialSidebarState = true;
  isOpenSidebar = false;
  currentScreenWidth = 0;

  constructor() {
    this.currentScreenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.currentScreenWidth = window.innerWidth;
  }

  onClickNavigationItem() {
    if (this.currentScreenWidth < 1024) {
      this.isOpenSidebar = !this.isOpenSidebar;
      this.isInitialSidebarState = false
    }
  }
}
