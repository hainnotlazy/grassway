import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { BrandBlockDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { CreateBlockDialogComponent } from '../create-block-dialog/create-block-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
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
      take(1),
      tap(brand => this.brandId = brand.id),
      switchMap(brand => this.brandsService.getBrandBlocks(brand.id)),
      tap(blocks => this.blocks = blocks),
      finalize(() => this.fetchedBuild = true),
    ).subscribe();
  }

  openCreateBlockDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(CreateBlockDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(
      filter(data => data),
      map(data => data as BrandBlockDraft),
      tap(newBlock => this.blocks = [newBlock, ...this.blocks]),
      untilDestroyed(this)
    ).subscribe();
  }

  drop(event: CdkDragDrop<BrandBlockDraft[]>) {
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
  }
}
