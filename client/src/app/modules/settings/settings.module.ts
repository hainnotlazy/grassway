import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { QrCodeFormComponent } from './components/qr-code-form/qr-code-form.component';

const pages = [
  IndexPage
]

const components = [
  QrCodeFormComponent
]

@NgModule({
  declarations: [
    ...pages,
    ...components
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
