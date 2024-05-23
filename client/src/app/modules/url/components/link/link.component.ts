import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Url } from 'src/app/core/models/url.model';

interface ExtendedUrl extends Url {
  client: string;
}
@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  host: {
    class: "block"
  }
})
export class LinkComponent {
  @Input() url!: ExtendedUrl;

  @ViewChild("copyTooltip") copyTooltip!: MatTooltip;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  onCopy() {
    this.copyTooltip.message = "Copied";
    this.snackbar.open("Copied", "x", {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })

    setTimeout(() => {
      this.copyTooltip.message = "Copy";
    }, 500)
  }

  onOpenDeleteDialog() {

  }
}
