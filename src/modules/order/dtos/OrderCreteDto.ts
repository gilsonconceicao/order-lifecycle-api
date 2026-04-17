import { OrderItemCreateDto } from "@/modules/orderItem/dtos/OrderItemCreateDto";
import { OrderStatus } from "@/shared/enums/OrderStatusts";

export class OrderCreteDto {
  customerName!: string;
  customerPhone!: string;
  deliveryAddress!: string;
  latitude!: number;
  longitude!: number;
  status!: OrderStatus;
  deliveryPersonId?: string;
  items?: OrderItemCreateDto[];
}