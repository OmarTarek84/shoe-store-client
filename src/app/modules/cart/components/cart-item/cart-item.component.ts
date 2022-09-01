import { catchError, of } from 'rxjs';
import { CartService } from './../../services/cart.service';
import { CartItemOutDto } from './../../models/cartDto';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() cartItem!: CartItemOutDto;
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  removeCart() {

  }

  changeQuantity(mode: string) {
    this.cartService.updateQuantity({productId: this.cartItem.productId, quantity: mode === 'inc' ? ++this.cartItem.quantity: --this.cartItem.quantity}).pipe(
      catchError(err => {
        if (mode === 'inc') this.cartItem.quantity--
        else this.cartItem.quantity++;
        return of(err);
      })
    ).subscribe();
  }

}
