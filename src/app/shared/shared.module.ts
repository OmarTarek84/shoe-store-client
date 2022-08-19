import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TextInputComponent } from './components/text-input/text-input.component';
import {MatIconModule} from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { SelectInputComponent } from './components/select-input/select-input.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';

const modules = [
  MatSnackBarModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatDialogModule,
  MatCardModule,
  MatSelectModule
];


@NgModule({
  declarations: [
    TextInputComponent,
    AddressFormComponent,
    SelectInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    modules
  ],
  exports: [modules,TextInputComponent,SelectInputComponent,AddressFormComponent,FormsModule,ReactiveFormsModule]
})
export class SharedModule { }
