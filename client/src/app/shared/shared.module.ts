import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QRCodeModule } from 'angularx-qrcode';
import { NgChartsModule } from 'ng2-charts';

import { TruncatePipe } from './pipes/truncate.pipe';
import { GetThirdPartyNamePipe } from './pipes/get-third-party-name.pipe';
import { CountdownPipe } from './pipes/countdown.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from "@angular/material/chips";
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { InputColorPickerComponent } from './components/input-color-picker/input-color-picker.component';
import { InputImageComponent } from './components/input-image/input-image.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';

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
  MatSlideToggleModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatStepperModule,
  MatExpansionModule,
  ClipboardModule,
  DragDropModule
]

const ExternalModules = [
  InfiniteScrollModule,
  QRCodeModule,
  NgChartsModule,
]

const Components = [
  InputColorPickerComponent,
  InputImageComponent,
  DeleteDialogComponent
]

const Pipes = [
  TruncatePipe,
  GetThirdPartyNamePipe,
  CountdownPipe,
  TimeAgoPipe,
]

@NgModule({
  declarations: [
    ...Pipes,
    ...Components,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MatModules,
    ...ExternalModules
  ],
  exports: [
    ReactiveFormsModule,
    ...Pipes,
    ...Components,
    ...MatModules,
    ...ExternalModules
  ]
})
export class SharedModule { }
