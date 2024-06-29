import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent {
  @Input() layoutControl!: FormControl;
  @Input() headerColorControl!: FormControl;
  @Input() backgroundColorControl!: FormControl;
  @Input() titleColorControl!: FormControl;
  @Input() descriptionColorControl!: FormControl;
}
