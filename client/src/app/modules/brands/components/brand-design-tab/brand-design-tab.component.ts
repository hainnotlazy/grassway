import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-design-tab',
  templateUrl: './brand-design-tab.component.html',
  styleUrls: ['./brand-design-tab.component.scss'],
  host: {
    class: "block py-4 space-y-4"
  }
})
export class BrandDesignTabComponent {
  designForm = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    prefix: new FormControl(""),
    layout: new FormControl(""),
    headerColor: new FormControl(""),
    backgroundColor: new FormControl(""),
    titleColor: new FormControl(""),
    descriptionColor: new FormControl(""),
    shape: new FormControl(""),
    shadow: new FormControl(""),
    blockBackgroundColor: new FormControl(""),
    blockTextColor: new FormControl("")
  })
}
