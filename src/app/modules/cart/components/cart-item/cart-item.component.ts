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

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  removeCart(productId: number) {
    this.cartService.removeCart(productId).subscribe(() => this.pricesChange());
  }

  changeQuantity(mode: string) {
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
