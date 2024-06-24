import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-brand-logo',
  templateUrl: './create-brand-logo.component.html',
  styleUrls: ['./create-brand-logo.component.scss']
})
export class CreateBrandLogoComponent {
  logoUrl = "./assets/images/grassway-logo.png";

  @Input() logoControl!: FormControl<null>;

  @ViewChild("logoInput") logoInput?: ElementRef;

  onLogoChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.logoControl.patchValue(file as any);
      this.logoControl.markAsDirty();
    }
  }

  openSelectLogo() {
    if (this.logoInput) {
      this.logoInput.nativeElement.click();
    }
  }
}
