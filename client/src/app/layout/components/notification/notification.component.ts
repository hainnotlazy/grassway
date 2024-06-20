import { Component, ViewChild } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  @ViewChild("menuTrigger") menuTrigger!: MatMenuTrigger;

  constructor(
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.notificationService.connect();
    // await setTimeout(() => {

    //   this.menuTrigger.openMenu();
    // }, 1);
  }
}
