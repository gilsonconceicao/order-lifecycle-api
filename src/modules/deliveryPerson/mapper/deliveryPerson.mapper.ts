import { mapOrderToOrderResponse } from "@/modules/order/mapper/order.mapper";
import { DeliveryPerson } from "../deliveryPerson.entity";
import { DeliveryPersonResponseDto } from "../dtos/DeliveryPersonResponseDto";

export function mapDeliveryPersonToDeliveryResponseDto(
  dp: DeliveryPerson,
): DeliveryPersonResponseDto {
  return {
    id: dp.id,
    createdAt: dp.createdAt,
    updatedAt: dp.updatedAt,
    currentLatitude: dp.currentLatitude,
    isActive: dp.isActive,
    name: dp.name,
    orders: dp.orders?.map(mapOrderToOrderResponse),
    phone: dp.phone,
    vehicleType: dp.vehicleType,
  };
}
