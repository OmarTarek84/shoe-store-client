import { AuthService } from './../../shared/services/auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, Observable, take } from "rxjs";

@Injectable({providedIn: 'root'})
export class LoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          return true;
        }
        this.router.navigate(["/auth/login"], {queryParams: {returnUrl: state.url}});
        return false;
      })
    )

  }

}
