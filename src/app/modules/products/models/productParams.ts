import { PaginationParams } from './../../../shared/models/paginationParams';

export class ProductParams extends PaginationParams {
    productName: string | null = null;
    fromPrice: string | null = null;
    toPrice: string | null = null;
    sort: string | null = null;
    brandId: number | null = null;

}
