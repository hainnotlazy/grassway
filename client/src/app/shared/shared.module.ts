import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TruncatePipe } from './pipes/truncate.pipe';
import { GetThirdPartyNamePipe } from './pipes/get-third-party-name.pipe';
import { CountdownPipe } from './pipes/countdown.pipe';

/* Angular Material Modules */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClipboardModule } from '@angular/cdk/clipboard';

const MatModules = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSnackBarModule,
  MatMenuModule,
  MatTabsModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatRadioModule,
  ClipboardModule
]

@NgModule({
  declarations: [
    TruncatePipe,
    GetThirdPartyNamePipe,
    CountdownPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MatModules,
  ],
  exports: [
    ReactiveFormsModule,
    TruncatePipe,
    GetThirdPartyNamePipe,
    CountdownPipe,
    ...MatModules,
  ]
})
export class SharedModule { }
