import { Component, Input } from '@angular/core';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-create-brand-option-user',
  templateUrl: './create-brand-option-user.component.html',
  styleUrls: ['./create-brand-option-user.component.scss']
})
export class CreateBrandOptionUserComponent {
  @Input() user!: User;
}
