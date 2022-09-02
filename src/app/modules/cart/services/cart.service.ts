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
    return this.http.get<CartItemOutDto[]>(environment.appUrl + 'api/Cart').pipe(
      map(cart => {
        this.cartSource.next(cart);
        return cart;
      })
    );
  }

  updateQuantity(cartItemInDto: CartItemInDto) {
    return this.http.patch<CartItemOutDto>(environment.appUrl + 'api/Cart', cartItemInDto).pipe(
      map(res => {
        let cart: CartItemOutDto[] = this.cartSource.value;
        let prodIndx = cart.findIndex(c => c.productId == res.productId);
        cart[prodIndx].quantity = res.quantity;
        this.cartSource.next(cart);
        return cart[prodIndx];
      })
    );
  }

  removeCart(productId: number) {
    return this.http.delete<boolean>(environment.appUrl + 'api/Cart?productId=' + productId).pipe(
      map(res => {
        if (res) {
          let cart: CartItemOutDto[] = this.cartSource.value;
          cart = cart.filter(c => c.productId != productId)
          this.cartSource.next(cart);
        }
      })
    );
  }

  getCartSourceFromObs() {
    return this.cartSource.value;
  }

}
