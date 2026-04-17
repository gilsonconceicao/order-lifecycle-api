import { FindOneOptions, FindOptionsWhere, IsNull, Repository } from "typeorm";
import { OrderItem } from "../orderItem.entity";
import { BaseRepository } from "@/infrastructure/repositories";
import { IOrderItemRepository } from "./IOrderItemRepository";

export class OrderItemRepository
  extends BaseRepository<OrderItem>
  implements IOrderItemRepository
{
  constructor(repository: Repository<OrderItem>) {
    super(repository);
  }
}
