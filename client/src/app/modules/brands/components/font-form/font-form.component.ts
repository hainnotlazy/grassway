import { getObjectValues } from 'src/app/core/helpers';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BrandFont } from 'src/app/core/models';

@Component({
  selector: 'app-font-form',
  templateUrl: './font-form.component.html',
  styleUrls: ['./font-form.component.scss'],
})
export class FontFormComponent {
  readonly BrandFont = BrandFont;
  readonly getObjectValues = getObjectValues;

  @Input() fontControl!: FormControl;
}
