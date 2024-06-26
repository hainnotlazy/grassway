import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-brand-finish',
  templateUrl: './create-brand-finish.component.html',
  styleUrls: ['./create-brand-finish.component.scss']
})
export class CreateBrandFinishComponent {
  @Output() finished = new EventEmitter();

  onFinished() {
    this.finished.emit();
  }
}
