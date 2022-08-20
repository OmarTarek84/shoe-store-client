import { OutDto } from "../../../shared/models/outDto";
import { ReviewOutDto } from "./reviewDto";

export interface ProductOutDto extends OutDto {
    name: string;
    description: string;
    image: string;
    numberOfReviews: number;
    originalPrice: number;
    priceAfterDiscount: number;
    brandName: string;
    avgRating: number;
    countInStock: number;
    reviews: ReviewOutDto[];
}
