import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent {
  @Input() designForm!: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    prefix: FormControl<string | null>;
    logo: FormControl<string | null>;
    layout: FormControl<string | null>;
    headerColor: FormControl<string | null>;
    backgroundColor: FormControl<string | null>;
    titleColor: FormControl<string | null>;
    descriptionColor: FormControl<string | null>;
    shape: FormControl<string | null>;
    shadow: FormControl<string | null>;
    blockBackgroundColor: FormControl<string | null>;
    blockTextColor: FormControl<string | null>;
  }>;
}
