import { Component, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @ViewChild("menuTrigger") menuTrigger!: MatMenuTrigger;

  async ngOnInit() {
    // await setTimeout(() => {

    //   this.menuTrigger.openMenu();
    // }, 1);
  }
}
