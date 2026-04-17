import { DeliveryPersonResumeDto } from "@/modules/deliveryPerson/dtos/DeliveryPersonResumeDto";
import { OrderItemResponseDto } from "@/modules/orderItem/dtos/OrderItemResponseDto";
import { OrderStatus } from "@/shared/enums/OrderStatusts";

export class OrderResponseDto {
  id!: string;

  customerName!: string;
  customerPhone!: string;
  deliveryAddress!: string;

  latitude!: number;
  longitude!: number;

  status!: OrderStatus;

  totalAmount!: number;

  deliveryPerson!: DeliveryPersonResumeDto | null;

  items!: OrderItemResponseDto[];

  createdAt!: Date;
  updatedAt?: Date;
}