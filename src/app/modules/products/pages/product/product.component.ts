import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Rating } from '../../enums/Rating';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit {

  cartQuantity: number = 1;
  productId: number = 0;
  reviewForm!: FormGroup;
  ratingList = Object.keys(Rating).filter(x => isNaN(parseInt(x)));

  constructor(public productService: ProductsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: ['Poor', [Validators.required]],
      comment: [null]
    });

    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.productService.getProduct(this.productId);
    }


  }

  ngAfterViewInit(): void {
    this.productService.getUserReview(this.productId).subscribe((userReview) => {
      if (userReview) {
        this.reviewForm.patchValue({
          rating: Rating[userReview.rating],
          comment: userReview.comment
        });
        this.reviewForm.updateValueAndValidity();

      }
    })
  }

  counter(i: number) {
    return new Array(i);
  }

}
