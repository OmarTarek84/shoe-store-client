import { CartItemInDto } from './../../../modules/cart/models/cartDto';
import { ProductsService } from './../../../modules/products/services/products.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { UserOutDto } from './../../../shared/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from './../../../shared/services/auth.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {
  @ViewChild('addressDialog') addressDialog!: TemplateRef<any>;

  addressForm!: FormGroup;
  dialogRef!: MatDialogRef<any>;
  user!: UserOutDto | null;

  cartItemsCountNoUser: number = 0;

  productName: string = '';

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private productService: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addressForm = this.fb.group({
      address: this.fb.group({
        street: [null, [Validators.required]],
        city: [null, [Validators.required]],
        country: [null, [Validators.required]],
        zipCode: [null, [Validators.required]],
        firstName: [null, [Validators.required]],
        lastName: [null, [Validators.required]],
      }),
    });
    this.authService.currentUser$
      .subscribe((user: UserOutDto | null) => {
        this.user = user;
        this.ref.detectChanges();
        if (this.user)
          this.addressForm.get('address')?.patchValue(this.user?.address);
      });

    this.authService.currentItemsCountNoUser$.subscribe(count => {
      this.cartItemsCountNoUser = count;
      this.ref.detectChanges();
    });

    if (!localStorage.getItem('token')) {
      const cartProdsString = localStorage.getItem('cartProducts') || JSON.stringify([]);
      let cartProds: CartItemInDto[] = JSON.parse(cartProdsString);
      this.cartItemsCountNoUser = cartProds.length;
    }

  }

  openAddressDialog() {
    this.dialogRef = this.dialog.open(this.addressDialog);
    this.dialogRef
      .afterOpened()
      .pipe(take(1))
      .subscribe(() => {
        if (this.user)
          this.addressForm.get('address')?.patchValue(this.user?.address);
      });
  }

  submitAddress() {
    this.authService
      .insertOrUpdateAddress(this.addressForm.get('address')?.value)
      .subscribe((address: any) => {
        if (this.user) {
          this.user.address = address;
          this.dialogRef.close();
        }
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  productNameChanged() {
    if (this.router.url.indexOf('/products') === 0) {
      let prodParams = this.productService.getProductParams();
      prodParams.productName = this.productName;
      this.productService.setProductParams(prodParams);
    } else {
      this.router.navigateByUrl('/products?search=' + this.productName);
    }

  }
}
