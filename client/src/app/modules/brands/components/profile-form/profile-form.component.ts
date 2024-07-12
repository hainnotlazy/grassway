import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationMessage, createBrandRequirements } from 'src/app/core/forms';
import { getObjectKeys } from 'src/app/core/helpers';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent {
  readonly defaultBrandLogo = "/assets/images/default-brand-logo.jpg";

  @Input() logoControl!: FormControl;
  @Input() titleControl!: FormControl;
  @Input() descriptionControl!: FormControl;

  // Form validation messages
  titleValidationMessages: ValidationMessage = createBrandRequirements.title.validationMsg;
  descriptionValidationMessages: ValidationMessage = createBrandRequirements.description.validationMsg;

  getObjectKeys = getObjectKeys;
}
