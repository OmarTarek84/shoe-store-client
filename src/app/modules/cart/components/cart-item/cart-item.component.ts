import { AuthService } from './../../../../shared/services/auth.service';
import { catchError, of, map } from 'rxjs';
import { CartService } from './../../services/cart.service';
import { CartItemOutDto } from './../../models/cartDto';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem!: CartItemOutDto;
  @Output() cartChange = new EventEmitter<any>();

  constructor(private cartService: CartService, private authService: AuthService) { }

  ngOnInit(): void {
  }

  removeCart(productId: number) {
    let token = localStorage.getItem('token');

    if (token)
      this.cartService.removeCart(productId).subscribe(() => this.pricesChange());
    else
      this.cartService.remCartAndUpdateCartSource(productId);
      this.pricesChange();
      this.authService.setCartItemsCount(this.cartService.getCartSourceFromObs().length);
      this.cartService.removeProductCartStorage(this.cartItem.productId);
  }

  changeQuantity(mode: string) {
    let token = localStorage.getItem('token');
    if (!token) {
      if (mode === 'inc') {
        this.cartItem.subtotal = 0;
        this.cartItem.subtotal += (++this.cartItem.quantity * this.cartItem.productPrice)
      } else {
        this.cartItem.subtotal = 0;
        this.cartItem.subtotal += (--this.cartItem.quantity * this.cartItem.productPrice)
      }
      this.cartService.AddProductCartItemsStorage({productId: this.cartItem.productId, quantity: this.cartItem.quantity});
      this.pricesChange();
      return;
    }
    this.cartService.updateQuantity({productId: this.cartItem.productId, quantity: mode === 'inc' ? ++this.cartItem.quantity: --this.cartItem.quantity}).pipe(
      map((res: CartItemOutDto) => {
          this.cartItem.subtotal = 0;
          this.cartItem.subtotal += (res.quantity * res.productPrice)
      }),
      catchError(err => {
        if (mode === 'inc') this.cartItem.quantity--
        else this.cartItem.quantity++;
        return of(err);
      })
    ).subscribe(() => this.pricesChange());
  }

  pricesChange() {
    this.cartChange.emit();
  }

}
