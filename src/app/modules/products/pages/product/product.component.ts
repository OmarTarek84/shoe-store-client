import { CartService } from './../../../cart/services/cart.service';
import { UserOutDto } from './../../../../shared/models/user';
import { AuthService } from './../../../../shared/services/auth.service';
import { ProductOutDto } from './../../models/productDto';
import { ReviewOutDto } from './../../models/reviewDto';
import { map, of, take } from 'rxjs';
import { switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Rating } from '../../enums/Rating';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  cartQuantity: number = 1;
  reviewForm!: FormGroup;
  ratingList = Object.keys(Rating)
    .filter((x) => !isNaN(parseInt(x)))
    .map((s) => parseInt(s));
  userHasReview: boolean = false;
  product!: ProductOutDto;
  user!: UserOutDto | null;

  constructor(
    public productService: ProductsService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      comment: [null],
    });

    this.authService.currentUser$
      .pipe(take(1))
      .subscribe((user: UserOutDto | null) => {
        this.user = user;
      });

    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.productService
        .getProduct(productId)
        .pipe(
          switchMap((prod: any) => {
            if (prod) {
              this.product = prod;
              return of(prod);
            } else {
              return this.productService.getProductFromAPI(productId).pipe(
                take(1),
                map((singleprod) => (this.product = singleprod))
              );
            }
          }),
          switchMap((prod) => {
            if (!localStorage.getItem('token')) return of();
            return this.productService.getUserReview(productId).pipe(
              take(1),
              map((userReview: ReviewOutDto) => {
                if (userReview) {
                  this.userHasReview = true;
                  this.reviewForm.setValue({
                    comment: userReview.comment,
                    rating: Rating[userReview.rating].toString(),
                  });
                }
              })
            );
          })
        )
        .subscribe();
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  reviewChanged(ev: any) {}

  addToCart() {
    this.cartService.addToCart([{
      productId: this.product.id,
      quantity: this.cartQuantity
    }]).pipe(
      map(cart => {
        if (this.user && cart && cart[0].quantity === 1) {
          this.user.cartItemsCount += 1;
          this.authService.setUser(this.user);
        } else if (!this.user && cart && cart[0].quantity === 1) {
          const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
          const cartProds = JSON.parse(cartProdsString);
          this.authService.setCartItemsCount(cartProds.length);
        }
      })
    ).subscribe(() => this._snackBar.open("Item added/updated to your cart", "close", {duration: 3000}));
  }

  reviewFormSubmitted() {
    this.productService
      .addReview({
        ...this.reviewForm.value,
        productId: this.product.id,
      })
      .pipe(
        take(1),
        map((review: ReviewOutDto) => {
          const reviewIndex = this.product.reviews.findIndex(
            (r) =>
              r.userEmail == this.user?.email && r.productId == review.productId
          );
          if (reviewIndex >= 0) this.product.reviews[reviewIndex] = review;
          else {
            this.product.reviews.push(review);
            this.product.numberOfReviews++;
          }

          this.product.avgRating = this.getAverageReviews();
        })
      )
      .subscribe();
  }

  private getAverageReviews() {
    return (
      this.product.reviews.map((r) => r.rating).reduce((a, b) => a + b) /
      this.product.reviews.length
    );
  }
}
