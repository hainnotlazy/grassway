import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss']
})
export class InputImageComponent {
  readonly defaultImageUrl = "./assets/images/grassway-logo.png";

  @Input() imageUrl!: string | null;
  @Input() control!: FormControl<string | null>;

  @ViewChild("imageInput") imageInput?: ElementRef;

  onImageChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageInput = e.target.result;
      };
      reader.readAsDataURL(file);

      this.control.patchValue(file as any);
      this.control.markAsDirty();
    }
  }

  openSelectImage() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    }
  }
}
