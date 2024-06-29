import { BrandFont } from './../../../../core/models/brand.enum';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-font-form',
  templateUrl: './font-form.component.html',
  styleUrls: ['./font-form.component.scss'],
  host: {
    class: "space-y-2"
  }
})
export class FontFormComponent {
  readonly BrandFont = BrandFont;

  @Input() fontControl!: FormControl;
}
