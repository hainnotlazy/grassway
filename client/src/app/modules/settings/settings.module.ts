import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputColorPickerComponent } from './components/input-color-picker/input-color-picker.component';
import { QrCodeFormComponent } from './components/qr-code-form/qr-code-form.component';


@NgModule({
  declarations: [
    IndexPage,
    InputColorPickerComponent,
    QrCodeFormComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule
  ]
})
export class SettingsModule { }
