import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrandsService } from 'src/app/core/services';
import { CreateLinkDialogComponent } from '../create-link-dialog/create-link-dialog.component';

@Component({
  selector: 'app-brand-links-tab',
  templateUrl: './brand-links-tab.component.html',
  styleUrls: ['./brand-links-tab.component.scss']
})
export class BrandLinksTabComponent {
  fetchedLinks = true;

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog
  ) {
    this.openCreateLinkDialog();
  }

  openCreateLinkDialog() {
    this.dialog.open(CreateLinkDialogComponent, {
      width: '600px',
      disableClose: true
    });
  }
}
