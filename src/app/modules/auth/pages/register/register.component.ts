import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { catchError, map, of, switchMap, timer, throwError } from 'rxjs';
import { AddressInDto } from './../../../../shared/models/address';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  returnUrl: string = '/products';

  constructor(private fb: FormBuilder, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/';
    this.registerForm = this.fb.group({

      userDetails: this.fb.group({
        email: [
          null,
          [Validators.required, Validators.email],
          [this.emailAlreadyExists()]
        ],
        password: [null, [Validators.required, this.validatePassword()]],
        confirmpassword: [null, [Validators.required, this.matchValues("password")]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
        userName: [null, [Validators.required]],
      }),
      address:this.fb.group({
        street: [null, [Validators.required]],
        city: [null, [Validators.required]],
        country: [null, [Validators.required]],
        zipCode: [null, [Validators.required]],
      })
    });

  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null : {isMatching: true}
    }
  }

  validatePassword(): ValidatorFn {
    return (control: AbstractControl) => {
      const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(control.value);
      return isValid ? null: {weakPassword: true}
    }
  }

  emailAlreadyExists(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) return of(null);
          return this.authService.emailExists(control.value).pipe(
            map((res: boolean) => {
              if (!res) return null;
              return {emailExists: true}
            })
          )
        }),
        catchError(err => {
          return of(null);
        }),
      );
    }
  }

  registerSubmitted() {
    const registerInDtoValue = this.registerForm.get('userDetails')?.value;
    const addressValue: AddressInDto = {
      ...this.registerForm.get('address')?.value,
      firstName: this.registerForm.get('userDetails')?.value?.firstName,
      lastName: this.registerForm.get('userDetails')?.value?.lastName,
    };
    this.authService.register(registerInDtoValue).pipe(
      switchMap(() => {
        return this.authService.insertOrUpdateAddress(addressValue)
      })
    ).subscribe(() => this.router.navigateByUrl(this.returnUrl));

  }

}
