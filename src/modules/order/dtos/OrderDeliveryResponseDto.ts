import { OrderStatus } from "@/shared/enums/OrderStatusts";

export class OrderDeliveryResponseDto {
  id!: string;
  deliveryAddress!: string;
  status!: OrderStatus;
}