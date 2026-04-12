import { Category } from "@/shared/enums/Category";

export type ProductCreateDto = {
  name: string;
  description: string;
  price: number;
  category: Category;
  preparationTime: number;
  imageUrl: string;
  isAvailable: boolean
}
