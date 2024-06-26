import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationMessage, createBrandRequirements } from 'src/app/core/forms';

@Component({
  selector: 'app-create-brand-basic-info',
  templateUrl: './create-brand-basic-info.component.html',
  styleUrls: ['./create-brand-basic-info.component.scss']
})
export class CreateBrandBasicInfoComponent {
  @Input() basicInfoForm!: FormGroup<{
    title: FormControl<string | null>;
    prefix: FormControl<string | null>;
    description: FormControl<string | null>;
  }>;

  // Form validation messages
  titleValidationMessages: ValidationMessage = createBrandRequirements.title.validationMsg;
  prefixValidationMessages: ValidationMessage = createBrandRequirements.prefix.validationMsg;
  descriptionValidationMessages: ValidationMessage = createBrandRequirements.description.validationMsg;

  getObjectKeys = getObjectKeys;
}
