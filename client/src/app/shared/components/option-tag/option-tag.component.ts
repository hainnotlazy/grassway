import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/core/models';

@Component({
  selector: 'app-option-tag',
  templateUrl: './option-tag.component.html',
  styleUrls: ['./option-tag.component.scss']
})
export class OptionTagComponent {
  @Input() tag!: Tag;
}
