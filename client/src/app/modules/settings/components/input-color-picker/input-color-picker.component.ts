import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-input-color-picker',
  templateUrl: './input-color-picker.component.html',
  styleUrls: ['./input-color-picker.component.scss']
})
export class InputColorPickerComponent {
  @Input() control!: FormControl;

  @ViewChild('colorInput') colorInput!: ElementRef;
  @ViewChild('colorPicker') colorPicker!: ElementRef;

  onChangeColor(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newValue = inputElement.value;
    this.control.patchValue(newValue);
  }

  ngOnInit() {
    this.control.valueChanges.pipe(
      tap((value) => {
        this.colorInput.nativeElement.value = value;
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
