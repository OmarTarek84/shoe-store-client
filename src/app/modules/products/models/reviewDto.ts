import { Rating } from "../enums/Rating";

export interface ReviewOutDto {
  rating: Rating;
  comment: string | null;
  userName: string;
  userEmail: string;
  productId: number;
}
