import { Category } from "@/shared/enums/Category";
export type ProductListPaginatedDto = {
  page: number;
  limit: number;
  name?: string;
  category?: Category;
  isAvailable?: boolean;
};
