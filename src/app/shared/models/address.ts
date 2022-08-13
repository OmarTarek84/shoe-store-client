export interface AddressOutDto {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface AddressInDto extends AddressOutDto {}
