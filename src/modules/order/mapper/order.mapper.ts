import { mapOrderItemCreateDtoToOrderItem } from "@/modules/orderItem/mapper/OrderItem.mapper";
import { OrderCreteDto } from "../dtos/OrderCreteDto";
import { OrderResponseDto } from "../dtos/OrderResponseDto";
import { Order } from "../order.entity";
import { OrderDeliveryResponseDto } from "../dtos/OrderDeliveryResponseDto";

export function mapOrderToOrderResponse(order: Order): OrderResponseDto {
  return {
    id: order.id,

    customerName: order.customerName,
    customerPhone: order.customerPhone,
    deliveryAddress: order.deliveryAddress,

    latitude: Number(order.latitude),
    longitude: Number(order.longitude),

    status: order.status,

    totalAmount: Number(order.totalAmount),

    deliveryPerson: order.deliveryPerson
      ? {
          id: order.deliveryPerson.id,
          name: order.deliveryPerson.name,
        }
      : null,

    items:
      order.items?.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
        },
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })) ?? [],

    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function mapOrderResponseToDelivery(order: Order): OrderDeliveryResponseDto {
  return {
    id: order.id,
    deliveryAddress: order.deliveryAddress,
    status: order.status,
  };
}

export function mapOrderCreateDtoToOrder(dto: OrderCreteDto, totalAmount: number): Partial<Order> {
  return {
    customerName: dto.customerName,
    customerPhone: dto.customerPhone,
    deliveryAddress: dto.deliveryAddress,
    latitude: dto.latitude,
    longitude: dto.longitude,
    status: dto.status,
    deliveryPersonId: dto.deliveryPersonId,
    totalAmount, 
    items: dto?.items?.map(mapOrderItemCreateDtoToOrderItem) ?? []
  };
}
