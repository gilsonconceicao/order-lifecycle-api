import { OrderStatus } from "@/shared/enums/OrderStatusts";
import { FindOptionsOrderValue } from "typeorm";

export class OrderListPaginatedDto {
  page!: number;
  limit!: number;
  status?: OrderStatus; 
  order_created_at?: FindOptionsOrderValue 
};
