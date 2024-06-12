import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage {
  logoUrl = './assets/images/grassway-logo.png';

  @ViewChild("logoInput") logoInput?: ElementRef;

  settingsForm = new FormGroup({
    backgroundColor: new FormControl(''),
    foregroundColor: new FormControl(''),
    showLogo: new FormControl(true),
    logo: new FormControl(''),
  });

  onLogoChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.settingsForm.patchValue({ logo: file as any });
      this.settingsForm.controls.logo.markAsDirty();
    }
  }

  openSelectLogo() {
    if (this.logoInput) {
      this.logoInput.nativeElement.click();
    }
  }
}
