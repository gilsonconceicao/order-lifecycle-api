import { IBaseRepository } from "@/infrastructure/repositories";
import { OrderItem } from "../orderItem.entity";

export interface IOrderItemRepository extends IBaseRepository<OrderItem> {}
