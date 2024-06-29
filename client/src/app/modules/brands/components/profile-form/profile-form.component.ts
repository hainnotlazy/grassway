import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { createBrandRequirements } from 'src/app/core/constants/brand-form-requirement.const';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  @Input() titleControl!: FormControl;
  @Input() descriptionControl!: FormControl;

  // Form validation messages
  titleValidationMessages: ValidationMessage = createBrandRequirements.title.validationMsg;
  descriptionValidationMessages: ValidationMessage = createBrandRequirements.description.validationMsg;

  getObjectKeys = getObjectKeys;
}
