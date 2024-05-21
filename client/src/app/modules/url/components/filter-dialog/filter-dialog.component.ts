import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetUrlsOptions, LinkTypeOptions } from 'src/app/core/interfaces/get-urls-options.interface';

export interface FilterDialogData {
  linkType: LinkTypeOptions;
}

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  filterForm = new FormGroup({
    linkType: new FormControl("all")
  })

  constructor(
    private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: GetUrlsOptions
  ) {}

  ngOnInit() {
    this.filterForm.patchValue({
      linkType: this.data.linkTypeOptions
    });
  }

  onFilterApply() {
    this.dialogRef.close(this.filterForm.value);
  }
}
