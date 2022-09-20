import { CartItemInDto } from './../models/cartDto';
import { environment } from './../../../../environments/environment';
import { BehaviorSubject, map, of, take } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { CartItemOutDto } from '../models/cartDto';

@Injectable({providedIn: 'root'})
export class CartService {

  private cartSource = new BehaviorSubject<CartItemOutDto[]>([]);
  cart$ = this.cartSource.asObservable();

  constructor(private http: HttpClient) {}

  getCart(from: string) {
    if (from === 'fromDB') {
      return this.http.post<CartItemOutDto[]>(environment.appUrl + 'api/Cart/cartProducts', []).pipe(
        map(cart => {
          this.cartSource.next(cart);
          return cart;
        })
      );
    } else {
      const cartProds = JSON.parse(localStorage.getItem('cartProducts')!);
      if (!cartProds || !cartProds.length) return of([]);

      return this.http.post<CartItemOutDto[]>(environment.appUrl + 'api/Cart/cartProducts', cartProds).pipe(
        map(cart => {
          this.cartSource.next(cart);
          return cart;
        })
      );
    }
  }

  AddProductCartItemsStorage(cartItemToBeadded: CartItemInDto) {
    const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
    const cartProds: CartItemInDto[] = JSON.parse(cartProdsString);

    const existingCartInd = cartProds.findIndex(c => c.productId === cartItemToBeadded.productId);
    if (existingCartInd >= 0) {
      cartProds[existingCartInd].quantity = cartItemToBeadded.quantity;
    } else {
      cartProds.push(cartItemToBeadded);
    }
    localStorage.setItem('cartProducts', JSON.stringify(cartProds));
  }


  removeProductCartStorage(productId: number) {
    const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
    let cartProds: CartItemInDto[] = JSON.parse(cartProdsString);

    const existingCartInd = cartProds.findIndex(c => c.productId === productId);
    if (existingCartInd >= 0) {
      cartProds = cartProds.filter(c => c.productId != productId);
    }
    localStorage.setItem('cartProducts', JSON.stringify(cartProds));
  }

  addStorageCartToDb() {
    const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
    let cartProds: CartItemInDto[] = JSON.parse(cartProdsString);
    if (cartProds.length > 0) {
      localStorage.removeItem('cartProducts');
      this.cartSource.next([]);
      return this.addToCart(cartProds);
    } else return of([]);
  }

  clearCartAfterLogout() {
    this.cartSource.next([]);
    localStorage.removeItem('cartProducts');
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
          this.remCartAndUpdateCartSource(productId);
        }
      })
    );
  }

  getCartSourceFromObs() {
    return this.cartSource.value;
  }

  remCartAndUpdateCartSource(productId: number) {
    let cart: CartItemOutDto[] = this.cartSource.value;
    cart = cart.filter(c => c.productId != productId)
    this.cartSource.next(cart);
  }

  addToCart(cartItems: CartItemInDto[]) {
    if (localStorage.getItem('token')) {
      return this.http.post<CartItemOutDto[]>(environment.appUrl + 'api/Cart', cartItems).pipe(
        map(cart => {
          cart.forEach(cartitem => {
            let cartSourceValue: CartItemOutDto[] = this.cartSource.value;
            if (cartitem.quantity > 1) {

              let prodIndx = cartSourceValue.findIndex(c => c.productId == cartitem.productId);
              if (prodIndx < 0) {
                cartSourceValue.push(cartitem);
                this.cartSource.next(cartSourceValue);
                return;
              }
              cartSourceValue[prodIndx].quantity += cartitem.quantity;
              this.cartSource.next(cartSourceValue);
            } else {
              cartSourceValue.push(cartitem);
              this.cartSource.next(cartSourceValue);
            }
          });
          return cart;
        })
      );
    } else {
      const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
      let cartProds: CartItemInDto[] = JSON.parse(cartProdsString);

      let newCartProducts: CartItemInDto[] = [];

      cartItems.forEach(cartitem => {
        const existingCartInd = cartProds.findIndex(c => c.productId === cartitem.productId);
        if (existingCartInd >= 0) {
          cartProds[existingCartInd].quantity += cartitem.quantity;
          newCartProducts.push(cartProds[existingCartInd]);
        } else {
          const newCartAdded = {productId: cartitem.productId, quantity: cartitem.quantity};
          cartProds.push(newCartAdded);
          newCartProducts.push(newCartAdded);
        }
      });
      localStorage.setItem('cartProducts', JSON.stringify(cartProds));

      return of(newCartProducts);

    }
  }

  createCheckoutSession() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post(environment.appUrl + 'api/Payment/checkout', {}, {headers,responseType: 'text'}).pipe(take(1));
  }

}
