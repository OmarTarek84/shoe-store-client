export interface Pagination<outDto> {
  list: outDto[];
  pageNumber: number;
  pageSize: number;
  count: number;
}
