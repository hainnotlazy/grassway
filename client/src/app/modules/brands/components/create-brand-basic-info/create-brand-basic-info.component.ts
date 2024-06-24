import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-brand-basic-info',
  templateUrl: './create-brand-basic-info.component.html',
  styleUrls: ['./create-brand-basic-info.component.scss']
})
export class CreateBrandBasicInfoComponent {
  @Input() basicInfoForm!: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
  }>;
}
