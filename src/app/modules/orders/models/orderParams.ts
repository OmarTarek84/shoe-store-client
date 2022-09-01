import { PaginationParams } from './../../../shared/models/paginationParams';

export class OrderParams extends PaginationParams {
    sortPrice: string | null = null;
    sortLatest: string | null = null;
}
