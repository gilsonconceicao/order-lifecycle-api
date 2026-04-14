import { IProductRepository } from "./repositories/IProductRepository";
import { Product } from "./product.entity";
import { AppError } from "../../shared/errors/Error.helper";
import { IOrderRepository } from "../order/repositories/IOrderRepository";
import { OrderStatus } from "../../shared/enums/OrderStatusts";
import { IPaginationList } from "../../shared/interfaces/IPaginationList";
import { Category } from "../../shared/enums/Category";
import { ProductListPaginatedDto } from "./dtos/ProductListPaginatedDto";
import { IUserContext } from "../../shared/interfaces/IUserAuthenticated";
import { ProductCreateDto } from "./dtos/ProductCreteDto";
import { mapUpInsertProduct } from "./mapper/product.mapper";
import { ProductUpdateDto } from "./dtos/ProductUpdateDto";

export class ProductService {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
  ) {}  

  async create(data: ProductCreateDto): Promise<Product> {
    return this.productRepository.create(mapUpInsertProduct(data));
  }

  async findAll(params: ProductListPaginatedDto, userContext: IUserContext): Promise<IPaginationList<Product>> {
    return this.productRepository.findAllPaginated(params, userContext);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product)
      throw new AppError("PRODUCT_NOT_FOUND", "Produto não encontrado", 404);

    return product;
  }

  async update(id: string, data: ProductUpdateDto): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product)
      throw new AppError("PRODUCT_NOT_FOUND", "Produto não encontrado", 404);

    return this.productRepository.update(id, mapUpInsertProduct(data));
  }

  async delete(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product)
      throw new AppError("PRODUCT_NOT_FOUND", "Produto não encontrado", 404);

    const orders = await this.orderRepository.findOrdersByProductId(product.id);

    if (
      orders.some((order) =>
        [OrderStatus.PENDING, OrderStatus.PREPARING].includes(order.status),
      )
    ) {
      throw new AppError(
        "PRODUCT_IN_ACTIVE_ORDER",
        "Não é possível realizar esta ação porque o produto está em um pedido com status 'PENDING' ou 'PREPARING'.",
        400,
        {
          blockingStatuses: [OrderStatus.PENDING, OrderStatus.PREPARING],
        },
      );
    }

    await this.productRepository.delete(id);
  }
}
