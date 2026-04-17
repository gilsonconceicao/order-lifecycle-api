import { OrderItemCreateDto } from "../dtos/OrderItemCreateDto";
import { OrderItem } from "../orderItem.entity";

export const mapOrderItemCreateDtoToOrderItem = (
  dto: OrderItemCreateDto,
): OrderItem => {
  return {
    orderId: dto.productId,
    quantity: dto.quantity,
  } as OrderItem;
};
