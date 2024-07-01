import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ValidationMessage, createBrandRequirements } from 'src/app/core/forms';
import { getObjectKeys } from 'src/app/core/helpers/utils';

@Component({
  selector: 'app-create-brand-socials',
  templateUrl: './create-brand-socials.component.html',
  styleUrls: ['./create-brand-socials.component.scss']
})
export class CreateBrandSocialsComponent {
  @Input() socialsForm!: FormGroup<{
    facebook: FormControl<string | null>;
    instagram: FormControl<string | null>;
    x: FormControl<string | null>;
    linkedin: FormControl<string | null>;
    github: FormControl<string | null>;
    tiktok: FormControl<string | null>;
    youtube: FormControl<string | null>;
    discord: FormControl<string | null>;
    website: FormControl<string | null>;
  }>;

  // Form validation messages
  facebookValidationMessages: ValidationMessage = createBrandRequirements.facebook.validationMsg;
  instagramValidationMessages: ValidationMessage = createBrandRequirements.instagram.validationMsg;
  xValidationMessages: ValidationMessage = createBrandRequirements.x.validationMsg;
  linkedinValidationMessages: ValidationMessage = createBrandRequirements.linkedin.validationMsg;
  githubValidationMessages: ValidationMessage = createBrandRequirements.github.validationMsg;
  tiktokValidationMessages: ValidationMessage = createBrandRequirements.tiktok.validationMsg;
  youtubeValidationMessages: ValidationMessage = createBrandRequirements.youtube.validationMsg;
  discordValidationMessages: ValidationMessage = createBrandRequirements.discord.validationMsg;
  websiteValidationMessages: ValidationMessage = createBrandRequirements.website.validationMsg;

  getObjectKeys = getObjectKeys;
}
