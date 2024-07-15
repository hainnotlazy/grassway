import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-brand-design-layout',
  templateUrl: './brand-design-layout.component.html',
  styleUrls: ['./brand-design-layout.component.scss'],
  host: {
    class: "flex gap-3 flex-wrap !-mx-2 sm:!-mx-0"
  }
})
export class BrandDesignLayoutComponent {
  @Input() control!: FormControl;
}
