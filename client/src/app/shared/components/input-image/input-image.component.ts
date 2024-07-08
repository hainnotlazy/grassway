import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss']
})
export class InputImageComponent implements OnChanges {
  @Input() imageUrl = "./assets/images/grassway-logo.png";
  @Input() control!: FormControl<string | null>;

  @ViewChild("imageInput") imageInput?: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes["control"] && this.control.value) {
      this.imageUrl = this.control.value;
    }
  }

  onImageChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
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
