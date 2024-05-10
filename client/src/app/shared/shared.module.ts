import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

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

const MatModules = [
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSnackBarModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...MatModules,
  ],
  exports: [
    ReactiveFormsModule,
    ...MatModules,
  ]
})
export class SharedModule { }
