import { CartItemInDto } from './../models/cartDto';
import { environment } from './../../../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { CartItemOutDto } from '../models/cartDto';

@Injectable({providedIn: 'root'})
export class CartService {

  private cartSource = new BehaviorSubject<CartItemOutDto[]>([]);
  cart$ = this.cartSource.asObservable();

  constructor(private http: HttpClient) {}

  getCart() {
    this.http.get<CartItemOutDto[]>(environment.appUrl + 'api/Cart').pipe(
      map(cart => {
        this.cartSource.next(cart);
      })
    ).subscribe();
  }

  updateQuantity(cartItemInDto: CartItemInDto) {
    return this.http.patch<boolean>(environment.appUrl + 'api/Cart', cartItemInDto);
  }

}
