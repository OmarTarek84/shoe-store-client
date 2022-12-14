import { CartService } from './../../modules/cart/services/cart.service';
import { RegisterDto } from './../../modules/auth/models/registerDto';
import { AuthOutDto } from './../../modules/auth/models/authDto';
import { LoginDto } from './../../modules/auth/models/loginDto';
import { environment } from './../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, ReplaySubject, Subject, take } from "rxjs";
import { UserOutDto } from "../models/user";
import { AddressInDto, AddressOutDto } from '../models/address';
import { ChangePasswordDto } from './../../modules/auth/models/changePasswordDto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({providedIn: 'root'})
export class AuthService {

  private token: string = '';

  private currentUserSource = new ReplaySubject<UserOutDto | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  private cartItemsCountNoUser = new Subject<number>();
  currentItemsCountNoUser$ = this.cartItemsCountNoUser.asObservable();

  constructor(private http: HttpClient,private _snackBar: MatSnackBar, private cartService: CartService) {}

  getUser() {
    return this.http.get<UserOutDto>(environment.appUrl + 'api/Auth/user').pipe(
      catchError((err) => {
        this.logout();
        return of(err);
      }),
      map((user: UserOutDto) => {
        this.currentUserSource.next(user);

        if (user.cartItemsCount === 0) {
          this.cartService.addStorageCartToDb().subscribe(cart => {
            if (cart.length) {
              let useroutDto = user;
              useroutDto.cartItemsCount = cart.length;
              this.currentUserSource.next(user);
            }
          })
        }

      })
    );
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  setCartItemsCount(count: number) {
    this.cartItemsCountNoUser.next(count);
  }

  login(loginDto: LoginDto) {
    return this.http.post<AuthOutDto>(environment.appUrl + 'api/Auth/login', loginDto).pipe(
      map((auth: AuthOutDto) => {
        if (auth) {
          this.setUserCredsAndDetails(auth);
        }
      })
    );
  }

  register(registerinDto: RegisterDto) {
    return this.http.post<AuthOutDto>(environment.appUrl + 'api/Auth/Register', registerinDto).pipe(
      map((auth: AuthOutDto) => {
        if (auth) {
          this.token = auth.token;
          localStorage.setItem('token', auth.token);
        }
      })
    );
  }

  setUser(user: UserOutDto | null) {
    this.currentUserSource.next(user);
  }

  setUserCredsAndDetails(auth: AuthOutDto) {
    this.token = auth.token;
    localStorage.setItem('token', auth.token);
    this.getUser().pipe(take(1)).subscribe();
  }

  logout() {
    localStorage.removeItem('token');
    this.cartService.clearCartAfterLogout();
    this.cartItemsCountNoUser.next(0);
    this.currentUserSource.next(null);
    this.token = '';
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.appUrl + `api/Auth/email-exists?email=${email}`);
  }

  insertOrUpdateAddress(address: AddressInDto) {
    return this.http.post<AddressOutDto>(environment.appUrl + "api/Auth/address", address).pipe(
      map((res: AddressOutDto) => {
        this.getUser().pipe(take(1)).subscribe();
        return res;
      })
    );
  }

  changePassword(changePasswordDto: ChangePasswordDto) {
    return this.http.patch<boolean>(environment.appUrl + "api/Auth/reset-password", changePasswordDto).pipe(
      map((res: boolean) => {
        if (res) this._snackBar.open('Password Changed', 'Close');
        return res;
      })
    );
  }

}
