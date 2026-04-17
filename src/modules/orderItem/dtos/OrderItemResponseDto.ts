import { ProductResumeDto } from "../../product/dtos/ProductResumeDto";

export class OrderItemResponseDto {
  id!: string;

  product!: ProductResumeDto;

  quantity!: number;

  unitPrice!: number;
}