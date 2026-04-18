import { IBaseRepository } from "@/infrastructure/repositories";
import { Order } from "../order.entity";
import { OrderStatus } from "@/shared/enums/OrderStatusts";
import { OrderListPaginatedDto } from "../dtos/OrderListPaginatedDto";
import { IPaginationList } from "@/shared/interfaces/IPaginationList";
import { OrderResponseDto } from "../dtos/OrderResponseDto";

export interface IOrderRepository extends IBaseRepository<Order> {
  updateStatus(id: string, status: OrderStatus): Promise<void>;
  assignDeliveryPerson(id: string, deliveryPersonId: string): Promise<void>;
  findOrdersByDeliveryPersonId (deliveryPersonId: string) : Promise<Order[]>; 
  findOrdersByProductId (productId: string) : Promise<Order[]>; 
  findReadyOrders(): Promise<Order[]>;
  findAllPaginated(params: OrderListPaginatedDto): Promise<IPaginationList<OrderResponseDto>>;
  findOrderById(id:string): Promise<OrderResponseDto | null>;
  findPendingOrdersByMinuteAfterCreated(time: number): Promise<Order[]>;
}
