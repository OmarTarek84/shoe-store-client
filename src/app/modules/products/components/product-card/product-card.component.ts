import { AuthService } from './../../../../shared/services/auth.service';
import { CartService } from './../../../cart/services/cart.service';
import { ProductOutDto } from './../../models/productDto';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, take } from 'rxjs';
import { UserOutDto } from 'src/app/shared/models/user';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: ProductOutDto;

  @Input() user!: UserOutDto | null;

  constructor(
    private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  goToProductDetail() {
    this.router.navigateByUrl(`/products/${this.product.id}`);
  }

  addToCart() {
    this.cartService
      .addToCart([
        {
          productId: this.product.id,
          quantity: 1,
        },
      ])
      .pipe(
        map((cart) => {
          if (this.user && cart && cart[0].quantity === 1) {
            this.user.cartItemsCount += 1;
            this.authService.setUser(this.user);
          } else if (!this.user && cart && cart[0].quantity === 1) {
            const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
            const cartProds = JSON.parse(cartProdsString);
            this.authService.setCartItemsCount(cartProds.length);
          }
        })
      )
      .subscribe(() =>
        this._snackBar.open('Item added/updated to your cart', 'close', {
          duration: 3000,
        })
      );
  }
}
