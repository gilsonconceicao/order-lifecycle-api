import { FindOneOptions, FindOptionsWhere, IsNull, LessThan, Repository } from "typeorm";
import { IOrderRepository } from "./IOrderRepository";
import { OrderStatus } from "../../../shared/enums/OrderStatusts";
import { IPaginationList } from "../../../shared/interfaces/IPaginationList";
import { OrderListPaginatedDto } from "../dtos/OrderListPaginatedDto";
import { mapOrderToOrderResponse } from "../mapper/order.mapper";
import { OrderResponseDto } from "../dtos/OrderResponseDto";
import { BaseRepository } from "@/infrastructure/repositories";
import { Order } from "../order.entity";

export class OrderRepository
  extends BaseRepository<Order>
  implements IOrderRepository
{
  constructor(repository: Repository<Order>) {
    super(repository);
  }
  
  async findPendingOrdersByMinuteAfterCreated(min: number): Promise<Order[]> {
    const now = new Date(Date.now() - min * 60 * 1000)

    const orders = await this.repository.find({
      where: {
        deletedAt: IsNull(),
        status: OrderStatus.PENDING, 
        createdAt: LessThan(now)
      }
    }); 

    return orders; 
  }

  async findOrderById(id: string): Promise<OrderResponseDto | null> {
    const order = await this.repository.findOne({
      where: { id },
      relations: {
        items: { product: true },
      },
    });
    if (!order) return null;
    return mapOrderToOrderResponse(order);
  }

  async findAllPaginated(
    params: OrderListPaginatedDto,
  ): Promise<IPaginationList<OrderResponseDto>> {
    const { limit, page, status, order_created_at = "DESC" } = params;

    const safePage = Math.max(page, 0);
    const safeLimit = Math.max(limit, 1);

    const skip = safePage * safeLimit;
    const take = safeLimit;

    const where: FindOptionsWhere<Order> = {};
    const order: FindOneOptions<Order>["order"] = {};

    if (status) {
      where.status = status;
    }

    if (order_created_at !== undefined) {
      order.createdAt = order_created_at;
    }

    const [data, total] = await this.repository.findAndCount({
      order: {...order, updatedAt: 'DESC'},
      where,
      take,
      skip,
      relations: {
        items: {
          product: true,
        },
        deliveryPerson: true,
      },
    });

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: data.map(mapOrderToOrderResponse),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  async findReadyOrders(): Promise<Order[]> {
    return this.repository.find({
      where: {
        status: OrderStatus.READY,
        deletedAt: IsNull(),
      },
    });
  }

  async findOrdersByDeliveryPersonId(
    deliveryPersonId: string,
  ): Promise<Order[]> {
    return await this.repository.find({
      where: {
        deliveryPersonId,
        deletedAt: IsNull(),
      },
      relations: {
        deliveryPerson: true,
      },
    });
  }

  async findOrdersByProductId(productId: string): Promise<Order[]> {
    return await this.repository
      .createQueryBuilder("order")
      .innerJoin("order.items", "item")
      .leftJoinAndSelect("order.deliveryPerson", "deliveryPerson")
      .where("item.productId = :productId", { productId })
      .andWhere("order.deletedAt IS NULL")
      .getMany();
  }

  async assignDeliveryPerson(
    id: string,
    deliveryPersonId: string,
  ): Promise<void> {
    await this.repository.update(id, { deliveryPersonId });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await this.repository.update(id, { status });
  }
}
