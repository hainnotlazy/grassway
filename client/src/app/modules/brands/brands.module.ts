import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { CreateBrandPage } from './pages/create-brand/create-brand.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateBrandBasicInfoComponent } from './components/create-brand-basic-info/create-brand-basic-info.component';
import { CreateBrandSocialsComponent } from './components/create-brand-socials/create-brand-socials.component';
import { CreateBrandLogoComponent } from './components/create-brand-logo/create-brand-logo.component';
import { CreateBrandInviteUserComponent } from './components/create-brand-invite-user/create-brand-invite-user.component';
import { CreateBrandFinishComponent } from './components/create-brand-finish/create-brand-finish.component';
import { CreateBrandOptionUserComponent } from './components/create-brand-option-user/create-brand-option-user.component';
import { ManageBrandPage } from './pages/manage-brand/manage-brand.component';
import { BrandDesignTabComponent } from './components/brand-design-tab/brand-design-tab.component';
import { BrandDesignLayoutComponent } from './components/brand-design-layout/brand-design-layout.component';
import { PageFormComponent } from './components/page-form/page-form.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { FontFormComponent } from './components/font-form/font-form.component';
import { BlocksFormComponent } from './components/blocks-form/blocks-form.component';
import { SocialsFormComponent } from './components/socials-form/socials-form.component';
import { BrandBuildTabComponent } from './components/brand-build-tab/brand-build-tab.component';
import { LoadingTabComponent } from './components/loading-tab/loading-tab.component';
import { ButtonBlockComponent } from './components/button-block/button-block.component';
import { ImageBlockComponent } from './components/image-block/image-block.component';
import { YoutubeBlockComponent } from './components/youtube-block/youtube-block.component';
import { CreateBlockDialogComponent } from './components/create-block-dialog/create-block-dialog.component';
import { BrandLinksTabComponent } from './components/brand-links-tab/brand-links-tab.component';
import { CreateLinkDialogComponent } from './components/create-link-dialog/create-link-dialog.component';
import { BrandLinkComponent } from './components/brand-link/brand-link.component';
import { UrlModule } from '../url/url.module';
import { UpdateBlockDialogComponent } from './components/update-block-dialog/update-block-dialog.component';
import { BrandSettingsTabComponent } from './components/brand-settings-tab/brand-settings-tab.component';
import { QrCodeFormComponent } from './components/qr-code-form/qr-code-form.component';
import { BrandMemberComponent } from './components/brand-member/brand-member.component';
import { InviteUserDialogComponent } from './components/invite-user-dialog/invite-user-dialog.component';
import { InvitationComponent } from './components/invitation/invitation.component';
import { BrandAnalyticsTabComponent } from './components/brand-analytics-tab/brand-analytics-tab.component';
import { AnalyticModule } from '../analytic/analytic.module';

@NgModule({
  declarations: [
    CreateBrandPage,
    CreateBrandBasicInfoComponent,
    CreateBrandSocialsComponent,
    CreateBrandLogoComponent,
    CreateBrandInviteUserComponent,
    CreateBrandFinishComponent,
    CreateBrandOptionUserComponent,
    ManageBrandPage,
    BrandDesignTabComponent,
    BrandDesignLayoutComponent,
    PageFormComponent,
    ProfileFormComponent,
    FontFormComponent,
    BlocksFormComponent,
    SocialsFormComponent,
    BrandBuildTabComponent,
    LoadingTabComponent,
    ButtonBlockComponent,
    ImageBlockComponent,
    YoutubeBlockComponent,
    CreateBlockDialogComponent,
    BrandLinksTabComponent,
    CreateLinkDialogComponent,
    BrandLinkComponent,
    UpdateBlockDialogComponent,
    BrandSettingsTabComponent,
    QrCodeFormComponent,
    BrandMemberComponent,
    InviteUserDialogComponent,
    InvitationComponent,
    BrandAnalyticsTabComponent
  ],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    UrlModule,
    AnalyticModule,
    SharedModule
  ]
})
export class BrandsModule { }
