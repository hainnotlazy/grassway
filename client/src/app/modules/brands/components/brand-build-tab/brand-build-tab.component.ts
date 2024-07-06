import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take, tap } from 'rxjs';
import { BrandBlockDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { CreateBlockDialogComponent } from '../create-block-dialog/create-block-dialog.component';

@Component({
  selector: 'app-brand-build-tab',
  templateUrl: './brand-build-tab.component.html',
  styleUrls: ['./brand-build-tab.component.scss']
})
export class BrandBuildTabComponent {
  fetchedBuild = false;
  brandId!: string;
  blocks: BrandBlockDraft[] = [];

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog
  ) {
    this.brandsService.currentBrand$.pipe(
      tap(brand => this.brandId = brand.id),
      switchMap(brand => this.brandsService.getBrandBlocks(brand.id)),
      tap(blocks => this.blocks = blocks),
      finalize(() => this.fetchedBuild = true),
      take(1)
    ).subscribe();

    // this.openCreateBlockDialog();
  }

  openCreateBlockDialog() {
    this.dialog.closeAll();
    this.dialog.open(CreateBlockDialogComponent, {
      width: '600px',
      disableClose: true
    })
  }

  drop(event: CdkDragDrop<BrandBlockDraft[]>) {
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
  }
}
