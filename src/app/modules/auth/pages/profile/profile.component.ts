import { take } from 'rxjs';
import { AuthService } from './../../../../shared/services/auth.service';
import { UserOutDto } from './../../../../shared/models/user';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, AfterViewChecked {

  user!: UserOutDto | null;
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: [{value: null, disabled: true}],
      userName: [{value: null, disabled: true}],
      zipCode: [{value: null, disabled: true}],
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, this.validatePassword()]],
      confirmPassword: [null, [Validators.required, this.matchValues('newPassword')]],
    });

  }

  ngAfterViewInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe((user: UserOutDto | null) => {
      this.user = user;
      this.profileForm.patchValue({
        email: user?.email,
        userName: user?.userName,
        zipCode: user?.address.zipCode,
      });
    });
  }

  validatePassword(): ValidatorFn {
    return (control: AbstractControl) => {
      const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(control.value);
      return isValid ? null: {weakPassword: true}
    }
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null : {isMatching: true}
    }
  }

  changePasswordSubmit() {
    this.authService.changePassword({
      currentPassword: this.profileForm.value.currentPassword,
      newPassword: this.profileForm.value.newPassword,
    }).subscribe(res => {
      if (res) {
        this.profileForm.get('currentPassword')?.reset();
        this.profileForm.get('newPassword')?.reset();
        this.profileForm.get('confirmPassword')?.reset();
      }
    })
  }
}
