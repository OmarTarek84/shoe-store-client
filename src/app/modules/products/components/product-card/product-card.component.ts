import { ProductOutDto } from './../../models/productDto';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product!: ProductOutDto;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToProductDetail() {
    this.router.navigateByUrl(`/products/${this.product.id}`)
  }

}
