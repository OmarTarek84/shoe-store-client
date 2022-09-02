import { take } from 'rxjs';
import { UserOutDto } from './../../../../shared/models/user';
import { AuthService } from './../../../../shared/services/auth.service';
import { CartItemOutDto } from './../../models/cartDto';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  subTotal: number = 0;
  totalPrice: number = 0;
  tax: number = 0;

  user!: UserOutDto | null;

  constructor(public cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
    this.cartService.getCart().subscribe((cart: any) => this.setPrices(cart));
  }

  pricesChanged() {
    const cart = this.cartService.getCartSourceFromObs();
    if (this.user) {
      this.user.cartItemsCount = cart.length;
      this.authService.setUser(this.user);
    }
    this.setPrices(cart);
  }

  setPrices(cartItems: CartItemOutDto[]) {
    this.subTotal = 0;
    this.tax = 0;
    this.totalPrice = 0;
    cartItems.forEach((item: CartItemOutDto) => {
      this.subTotal += (item.quantity * item.productPrice);
    });
    this.tax = this.subTotal * (12 / 100);
    this.totalPrice = this.subTotal + this.tax;
  }

}
