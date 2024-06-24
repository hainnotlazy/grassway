import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-brand-socials',
  templateUrl: './create-brand-socials.component.html',
  styleUrls: ['./create-brand-socials.component.scss']
})
export class CreateBrandSocialsComponent {
  @Input() socialsForm!: FormGroup<{
    facebook: FormControl<string | null>;
    instagram: FormControl<string | null>;
    twitter: FormControl<string | null>;
    linkedin: FormControl<string | null>;
    github: FormControl<string | null>;
    tiktok: FormControl<string | null>;
    youtube: FormControl<string | null>;
    discord: FormControl<string | null>;
    website: FormControl<string | null>;
  }>;
}
