import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-changer',
  templateUrl: './theme-changer.component.html',
  styleUrls: ['./theme-changer.component.scss']
})
export class ThemeChangerComponent {
  isDarkMode = true;
  private darkModeClass = "dark";

  constructor() {
    if (this.isDarkMode) {
      document.documentElement.classList.add(this.darkModeClass);
    }
  }

  onChangeTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle(this.darkModeClass);
  }
}
