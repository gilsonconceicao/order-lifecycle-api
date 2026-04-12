import { OrderStatus } from "../enums/OrderStatusts";

export function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(OrderStatus)
    .map((s) => s.toLowerCase())
    .includes(value.toLowerCase() as OrderStatus);
}
