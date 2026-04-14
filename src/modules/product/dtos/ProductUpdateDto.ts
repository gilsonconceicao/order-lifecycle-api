import { ProductCreateDto } from "./ProductCreteDto";

export type ProductUpdateDto = {} & Partial<ProductCreateDto>