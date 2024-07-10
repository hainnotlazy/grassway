import { Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, finalize, mergeMap, switchMap, take, tap } from 'rxjs';
import { Brand, BrandMember, BrandMemberRole } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';

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
    private brandsService: BrandsService
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brand = brand),
      switchMap(brand => this.brandsService.getBrandMembers(brand.id)),
      tap(members => this.members = members),
      mergeMap(members => members),
      filter(member => member.role === BrandMemberRole.OWNER),
      tap(() => this.isOwner = false),
      finalize(() => this.fetchedMember = true),
      untilDestroyed(this)
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
}
