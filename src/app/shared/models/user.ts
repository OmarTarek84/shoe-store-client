import { AddressOutDto } from "./address";

export interface UserOutDto {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  cartItemsCount: number;
  address: AddressOutDto;
  pJoinedAt: Date;
}
