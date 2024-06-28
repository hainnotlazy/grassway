import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { createBrandRequirements } from 'src/app/core/constants/brand-form-requirement.const';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
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

  // Form validation messages
  titleValidationMessages: ValidationMessage = createBrandRequirements.title.validationMsg;
  descriptionValidationMessages: ValidationMessage = createBrandRequirements.description.validationMsg;
  prefixValidationMessages: ValidationMessage = createBrandRequirements.prefix.validationMsg;

  getObjectKeys = getObjectKeys;
}
