import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private _snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err)
          if (err.error && err.error.message) this._snackBar.open(err.error.message, 'Close', {duration: 3000});
          else if (err.error && err.error.status)
            switch (err.error.status) {
              case 404: this._snackBar.open('Not Found', 'Close', {duration: 3000}); break;
              case 500: this._snackBar.open('Internal Server Error', 'Close', {duration: 3000}); break;
              case 401: this._snackBar.open('Not Authorized', 'Close', {duration: 3000}); break;
              case 403: this._snackBar.open('You have to permission', 'Close', {duration: 3000}); break;
              default: this._snackBar.open('Unknown Error Occurred, please try again', 'Close', {duration: 3000});
            }
          else {
            switch (err.status) {
              case 404: this._snackBar.open('Not Found', 'Close', {duration: 3000}); break;
              case 500: this._snackBar.open('Internal Server Error', 'Close', {duration: 3000}); break;
              case 401: this._snackBar.open('Not Authorized', 'Close', {duration: 3000}); break;
              case 403: this._snackBar.open('You have to permission', 'Close', {duration: 3000}); break;
              default: this._snackBar.open('Unknown Error Occurred, please try again', 'Close', {duration: 3000});
            }
          }
        return throwError(() => err);
      })
    );

  }
}
