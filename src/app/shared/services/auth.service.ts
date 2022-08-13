import { RegisterDto } from './../../modules/auth/models/registerDto';
import { AuthOutDto } from './../../modules/auth/models/authDto';
import { LoginDto } from './../../modules/auth/models/loginDto';
import { environment } from './../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, of, ReplaySubject } from "rxjs";
import { UserOutDto } from "../models/user";

@Injectable({providedIn: 'root'})
export class AuthService {

  private token$ = new Observable<string>();

  private currentUserSource = new ReplaySubject<UserOutDto | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<UserOutDto>(environment.appUrl + 'api/Auth/user').pipe(
      map((user: UserOutDto) => this.currentUserSource.next(user))
    );
  }

  getToken() {
    return this.token$ || localStorage.getItem('token');
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
    this.http.post<AuthOutDto>(environment.appUrl + 'api/Auth/Register', registerinDto).pipe(
      map((auth: AuthOutDto) => {
        if (auth) {
          this.setUserCredsAndDetails(auth);
        }
      })
    );
  }

  setUserCredsAndDetails(auth: AuthOutDto) {
    this.token$ = of(auth.token);
    localStorage.setItem('token', auth.token);
    this.getUser();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
  }

  emailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(environment.appUrl + `api/Auth/email-exists?email=${email}`);
  }

}
