import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { getObjectValues } from 'src/app/core/helpers';
import { BlockImageRatio, BlockType } from 'src/app/core/models';

@UntilDestroy()
@Component({
  selector: 'app-create-block-dialog',
  templateUrl: './create-block-dialog.component.html',
  styleUrls: ['./create-block-dialog.component.scss']
})
export class CreateBlockDialogComponent {
  readonly BlockType = BlockType;
  readonly BlockImageRatio = BlockImageRatio;

  form = new FormGroup({
    type: new FormControl(BlockType.BUTTON),
    title: new FormControl("", [
      Validators.required
    ]),
    description: new FormControl(""),
    image: new FormControl(""),
    imageRatio: new FormControl(BlockImageRatio.RATIO_ORIGIN),
    youtubeUrl: new FormControl(""),
    urlType: new FormControl("new"),
    url: new FormControl("")
  });

  constructor() {
    // this.form.controls.type.valueChanges.pipe(
    //   filter(type => !!type),
    //   filter(type => getObjectValues(BlockType).includes(type as string)),
    //   untilDestroyed(this)
    // ).subscribe();
  }
}
