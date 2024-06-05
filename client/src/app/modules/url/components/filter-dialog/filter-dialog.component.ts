import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GetUrlsOptions, LinkTypeOptions } from 'src/app/core/interfaces/get-urls-options.interface';
import { Tag } from 'src/app/core/models/tag.model';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {
  filterForm = new FormGroup({
    tagId: new FormControl(""),
    linkTypeOptions: new FormControl("all"),
    startDate: new FormControl(""),
    endDate: new FormControl("")
  })

  constructor(
    private dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      filterOptions: GetUrlsOptions,
      tags: Tag[]
    }
  ) {}

  ngOnInit() {
    this.filterForm.patchValue({
      tagId: this.data.filterOptions.tagId || "",
      linkTypeOptions: this.data.filterOptions.linkTypeOptions,
      startDate: this.data.filterOptions.startDate?.toString(),
      endDate: this.data.filterOptions.endDate?.toString()
    });
  }

  onFilterApply() {
    if (this.filterForm.get("startDate")?.value && this.filterForm.get("endDate")?.value) {
      this.filterForm.patchValue({
        startDate: this.getCorrectTime(this.filterForm.value.startDate as string).toISOString().split("T")[0],
        endDate: this.getCorrectTime(this.filterForm.value.endDate as string).toISOString().split("T")[0]
      });
    }
    this.dialogRef.close(this.filterForm.value);
  }

  onClearFilter() {
    this.dialogRef.close({
      tagId: "",
      linkTypeOptions: LinkTypeOptions.ALL,
      startDate: "",
      endDate: ""
    });
  }

  private getCorrectTime(time: string): Date {
    const correctTime = new Date(time);
    correctTime.setMinutes(correctTime.getMinutes() - correctTime.getTimezoneOffset());
    return correctTime;
  }
}
