import { FindOptionsWhere, In, Like, Repository } from "typeorm";
import { IProductRepository } from "./IProductRepository";
import { IPaginationList } from "../../../shared/interfaces/IPaginationList";
import { ProductListPaginatedDto } from "../dtos/ProductListPaginatedDto";
import { IUserContext } from "../../../shared/interfaces/IUserAuthenticated";
import { isAdmin } from "@/shared/utils";
import { BaseRepository } from "@/infrastructure/repositories";
import { Product } from "../product.entity";

export class ProductRepository
  extends BaseRepository<Product>
  implements IProductRepository
{
  constructor(repository: Repository<Product>) {
    super(repository);
  }
  
  async findByIds(ids: string[]): Promise<Product[]> {
    return await this.repository.find({
      where: {
        id: In(ids)
      }
    })
  }

  async findAllPaginated(
    params: ProductListPaginatedDto,
    userContext: IUserContext,
  ): Promise<IPaginationList<Product>> {
    const { limit, page, category, isAvailable, name } = params;
    const isUserAdmin = isAdmin(userContext);
    const safePage = Math.max(page, 0);
    const safeLimit = Math.max(limit, 1);

    const skip = safePage * safeLimit;
    const take = safeLimit;

    const where: FindOptionsWhere<Product> = {};

    if (category) {
      where.category = category;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }
 
    if (!isUserAdmin) {
      where.isAvailable = true;
    }
    
    if (name) {
      where.name = Like(`%${name.toLowerCase()}%`);
    }

    const [data, total] = await this.repository.findAndCount({
      order: { updatedAt: "DESC" },
      where: { ...where },
      take,
      skip,
    });

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }
}
