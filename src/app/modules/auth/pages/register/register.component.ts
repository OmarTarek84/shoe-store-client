import { AuthService } from './../../../../shared/services/auth.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { catchError, map, of, switchMap, timer, throwError } from 'rxjs';
import { Country } from '@angular-material-extensions/select-country';
import { AddressInDto } from './../../../../shared/models/address';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({

      userDetails: this.fb.group({
        email: [
          null,
          [Validators.required, Validators.email],
          [this.emailAlreadyExists()]
        ],
        password: [null, [Validators.required]],
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
    const countryDetails = (this.registerForm.get('address')?.get('country')?.value) as Country;

    const registerInDtoValue = this.registerForm.get('userDetails')?.value;
    const addressValue: AddressInDto = {
      ...this.registerForm.get('address')?.value,
      country: countryDetails.name,
      firstName: this.registerForm.get('userDetails')?.value?.firstName,
      lastName: this.registerForm.get('userDetails')?.value?.lastName,
    };
    console.log('registerInDtoValue',registerInDtoValue);
    console.log('addressValue',addressValue);

  }

}
