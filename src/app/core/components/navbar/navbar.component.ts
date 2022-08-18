import { take } from 'rxjs';
import { UserOutDto } from './../../../shared/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../shared/services/auth.service';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {

  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;

  addressForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  user!: UserOutDto | null;

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
    this.authService.currentUser$.pipe(take(1)).subscribe((user: UserOutDto | null) => {
      this.user = user;
      if (this.user) this.addressForm.get('address')?.patchValue(this.user?.address);
    });
  }

  openAddressDialog() {
    this.dialogRef = this.dialog.open(this.addressDialog);
    this.dialogRef.afterOpened().pipe(take(1)).subscribe(() => {
      if (this.user) this.addressForm.get('address')?.patchValue(this.user?.address);
    })
  }

  submitAddress() {
    this.authService.insertOrUpdateAddress(this.addressForm.get('address')?.value).subscribe((address: any) => {
      if (this.user) {
        this.user.address = address;
        this.dialogRef.close();
      }
    });

  }
}
