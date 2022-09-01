export interface CartItemOutDto {
  productName: string;
  productImage: string;
  productId: number;
  quantity: number;
  productPrice: number;
  subtotal: number;
}

export interface CartItemInDto {
  productId: number;
  quantity: number;
}
