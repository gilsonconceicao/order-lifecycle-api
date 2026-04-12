export interface IPaginationList<T> {
  data: T[];
  pagination: IPagination;
}

interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
