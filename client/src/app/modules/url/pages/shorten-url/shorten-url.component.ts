import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { shortenUrlRequirements } from 'src/app/core/constants/url-form-requirement.const';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { FormValidator } from 'src/app/core/validators/form.validator';

@Component({
  selector: 'shorten-url-page',
  templateUrl: './shorten-url.component.html',
  styleUrls: ['./shorten-url.component.scss']
})
export class ShortenUrlPage {
  formError = "";
  hidePassword = true;
  isProcessing = false;

  // Form requirements
  originUrlRequirements = shortenUrlRequirements.originUrl.requirements;

  // Form validation messages
  originUrlValidationMessages: ValidationMessage = shortenUrlRequirements.originUrl.validationMsg;

  getObjectKeys = getObjectKeys;

  form = new FormGroup({
    originUrl: new FormControl("", [
      Validators.required,
      FormValidator.validUrl
    ]),
    title: new FormControl(""),
    description: new FormControl(""),
    customBackHalf: new FormControl(""),
    password: new FormControl("")
  })

  constructor() {}


}
