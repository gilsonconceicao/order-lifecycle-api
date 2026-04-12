import { IBaseRepository } from "@/infrastructure/repositories/IBaseRepository";
import { Product } from "../product.entity";
import { ProductListPaginatedDto } from "../dtos/ProductListPaginatedDto";
import { IPaginationList, IUserContext } from "@/shared/interfaces";

export interface IProductRepository extends IBaseRepository<Product>{
    findAllPaginated(params: ProductListPaginatedDto, user: IUserContext): Promise<IPaginationList<Product>>; 
    findByIds(ids: string[]): Promise<Product[]>;
}
