import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {
    class: 'select-none'
  }
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
