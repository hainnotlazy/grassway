import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand, BrandMember, BrandMemberRole } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { DestroyDialogComponent } from 'src/app/shared/components/destroy-dialog/destroy-dialog.component';
import { InviteUserDialogComponent } from '../invite-user-dialog/invite-user-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-brand-settings-tab',
  templateUrl: './brand-settings-tab.component.html',
  styleUrls: ['./brand-settings-tab.component.scss']
})
export class BrandSettingsTabComponent {
  brand!: Brand;
  members: BrandMember[] = [];
  isOwner = true;
  fetchedMember = false;

  isProcessingSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brand = brand),
      switchMap(brand => this.brandsService.getBrandMembers(brand.id)),
      tap(members => this.members = members),
      switchMap(() => this.brandsService.getRole(this.brand.id)),
      tap(member => this.isOwner = member.role === BrandMemberRole.OWNER),
      finalize(() => this.fetchedMember = true),
      untilDestroyed(this)
    ).subscribe();
  }

  openInviteUserDialog() {
    this.dialog.closeAll();

    const inviteUserDialog = this.dialog.open(InviteUserDialogComponent, {
      data: {
        membersId: this.members.map(member => member.user?.id),
      },
      width: "500px",
      disableClose: true,
    })

    inviteUserDialog.afterClosed().pipe(
      filter(data => !!data),
      map(data => data as BrandMember[]),
      tap(data => this.members = [...this.members, ...data]),
    ).subscribe();
  }

  onTransferredOwnership(member: BrandMember) {
    this.isOwner = false;
    this.members = this.members.map(m => {
      if (m.user?.id === member.user?.id) {
        m.role = BrandMemberRole.OWNER;
        return m;
      }
      return m;
    });
  }

  onMemberDeleted(member: BrandMember) {
    this.members = this.members.filter(m => m.user?.id !== member.user?.id);
  }

  onDestroyBrand() {
    this.dialog.closeAll();

    const destroyDialog = this.dialog.open(DestroyDialogComponent, {
      width: "500px",
      data: {
        title: `You are going to delete permanently brand ${this.brand.title}`,
        itemName: this.brand.title,
      }
    });

    destroyDialog.afterClosed().pipe(
      take(1),
      filter(data => !!data),
      switchMap(() => this.brandsService.deleteBrand(this.brand.id)),
      switchMap(() => this.brandsService.brands$),
      take(1),
      tap(brands => this.brandsService.setBrands(brands.filter(brand => brand.id !== this.brand.id))),
      tap(() => {
        this.snackbar.open(`Brand ${this.brand.title} has been deleted successfully`, 'x', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/u/brands']);
      }),
      catchError(err => {
        this.handleDeleteBrandFail(err);
        return err;
      }),
      untilDestroyed(this)
    ).subscribe()
  }

  onLeaveBrand() {
    this.dialog.closeAll();

    const leaveDialog = this.dialog.open(DestroyDialogComponent, {
      width: "400px",
      data: {
        title: `You are going to leave brand ${this.brand.title}`,
        itemName: this.brand.title,
        headingIcon: "icon-logout",
        processBtnText: "Leave",
      }
    });

    leaveDialog.afterClosed().pipe(
      take(1),
      filter(data => !!data),
      switchMap(() => this.brandsService.leaveBrand(this.brand.id)),
      switchMap(() => this.brandsService.brands$),
      take(1),
      tap(brands => this.brandsService.setBrands(brands.filter(brand => brand.id !== this.brand.id))),
      tap(() => {
        this.snackbar.open(`You have left brand ${this.brand.title} successfully`, 'x', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate(['/u/brands']);
      }),
      catchError(err => {
        this.handleDeleteBrandFail(err);
        return err;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  private handleDeleteBrandFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
