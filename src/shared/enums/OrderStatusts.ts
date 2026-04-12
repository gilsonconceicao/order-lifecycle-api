export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY = "ready",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  CANCELLED = "cancelled"
}

export const orderStatusTransition: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],

  [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],

  [OrderStatus.READY]: [OrderStatus.DELIVERING, OrderStatus.CANCELLED],

  [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED],

  [OrderStatus.DELIVERED]: [],

  [OrderStatus.CANCELLED]: [],
};