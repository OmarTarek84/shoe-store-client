import { OutDto } from './../../../shared/models/outDto';
import { OrderItemOutDto } from './orderItemDto';

export interface OrderOutDto extends OutDto {
    orderDate: string;
    subtotal: number;
    totalPrice: number;
    orderItems: OrderItemOutDto[];
}
