import { ProductCreateDto } from "../dtos/ProductCreteDto";
import { ProductUpdateDto } from "../dtos/ProductUpdateDto";
import { Product } from "../product.entity";

export function mapUpInsertProduct(
  dto: ProductCreateDto | ProductUpdateDto
): Partial<Product> {
  return {
    name: dto.name,
    description: dto.description,
    price: dto.price,
    category: dto.category,
    preparationTime: dto.preparationTime, 
    imageUrl: dto.imageUrl, 
    isAvailable: dto.isAvailable
  };
}
