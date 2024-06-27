import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss']
})
export class InputImageComponent {
  imageUrl = "./assets/images/grassway-logo.png";

  @ViewChild("imageInput") imageInput?: ElementRef;

  onImageChange(event: Event) {

  }

  openSelectImage() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    }
  }
}
