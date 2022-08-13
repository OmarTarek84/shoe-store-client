import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;

  addressForm!: FormGroup;

  constructor(public authService: AuthService,private dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      address: this.fb.group({
        street: [null, [Validators.required]],
        city: [null, [Validators.required]],
        country: [null, [Validators.required]],
        zipCode: [null, [Validators.required]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
      })
    });
    console.log(this.addressForm);

  }

  openAddressDialog() {
    this.dialog.open(this.addressDialog);
  }

  submitAddress() {
    console.log(this.addressForm.value);

  }
}
