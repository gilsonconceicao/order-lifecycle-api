import { IPaginationList } from "@/shared/interfaces/IPaginationList";
import { IDeliveryPersonRepository } from "../deliveryPerson/repositories/IDeliveryPersonRepository";
import { OrderListPaginatedDto } from "./dtos/OrderListPaginatedDto";
import { Order } from "./order.entity";
import { IOrderRepository } from "./repositories/IOrderRepository";
import { OrderResponseDto } from "./dtos/OrderResponseDto";
import { OrderStatus } from "@/shared/enums/OrderStatusts";
import { OptimizeAssignmentResponse } from "./dtos/OptimizeAssignmentDto";
import { haversineDistance } from "@/shared/algorithms/hungarian.algorithm";
import { Munkres } from "munkres-js";
import { AppError } from "@/shared/errors/Error.helper";
import {
  validateOrderCreate,
  validateOrderStatusUpdate,
} from "./order.validators";
import { IProductRepository } from "../product/repositories/IProductRepository";
import { IOrderItemRepository } from "../orderItem/repositories/IOrderItemRepository";
import { OrderItem } from "../orderItem/orderItem.entity";
import { OrderCreteDto } from "./dtos/OrderCreteDto";
import { mapOrderCreateDtoToOrder } from "./mapper/order.mapper";

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private deliveryPersonRepository: IDeliveryPersonRepository,
    private productRepository: IProductRepository,
    private orderItemRepository: IOrderItemRepository,
  ) {}

  async create(data: OrderCreteDto): Promise<Order> {
    const items = (data.items ?? []) as OrderItem[];
    const productIds = items?.map((i) => i.productId) ?? [];
    const products = await this.productRepository.findByIds(productIds);

    if (data.deliveryPersonId) {
      const deliveryPerson = await this.deliveryPersonRepository.findById(
        data.deliveryPersonId,
      );
      if (!deliveryPerson) {
        throw new AppError(
          "DELIVERY_PERSON_NOT_FOUND",
          "Entregador não encontrado",
          404,
        );
      }
    }

    validateOrderCreate(products, productIds);

    const totalAmount = (items ?? []).reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    let order = await this.orderRepository.create(mapOrderCreateDtoToOrder(data, totalAmount));

    const createdItems: OrderItem[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)!;
      const createdItem = await this.orderItemRepository.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price
      });
      createdItems.push(createdItem);
    }

    order.items = createdItems;

    return order;
  }

  async findAll(
    params: OrderListPaginatedDto,
  ): Promise<IPaginationList<OrderResponseDto>> {
    return this.orderRepository.findAllPaginated(params);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOrderById(id);

    if (!order)
      throw new AppError("ORDER_NOT_FOUND", "Pedido não encontrado", 404);

    return order;
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order)
      throw new AppError("ORDER_NOT_FOUND", "Pedido não encontrado", 404);

    await this.orderRepository.delete(id);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order)
      throw new AppError("ORDER_NOT_FOUND", "Pedido não encontrado", 404);

    validateOrderStatusUpdate(order, status);

    await this.orderRepository.updateStatus(id, status);
  }

  async assign(id: string, deliveryPersonId: string): Promise<void> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND", "Pedido não encontrado", 404);
    }

    const deliveryPerson =
      await this.deliveryPersonRepository.findById(deliveryPersonId);

    if (!deliveryPerson) {
      throw new AppError(
        "DELIVERY_PERSON_NOT_FOUND",
        "Entregador não encontrado",
        404,
      );
    }

    const ordersRelatedPerson =
      await this.orderRepository.findOrdersByDeliveryPersonId(deliveryPersonId);

    if (
      ordersRelatedPerson.some(
        (order) => order.status === OrderStatus.DELIVERING,
      )
    ) {
      throw new AppError(
        "DELIVERY_PERSON_UNAVAILABLE",
        "Este entregador ja esta atribuido a outro pedido em andamento",
        422
      );
    }

    await this.orderRepository.assignDeliveryPerson(id, deliveryPersonId);
  }

  async optimizeAssignment(): Promise<OptimizeAssignmentResponse> {
    const start = performance.now();

    const orders = await this.orderRepository.findReadyOrders();
    const deliveries = await this.deliveryPersonRepository.findAvailable();

    if (!orders.length) {
      return {
        assignments: [],
        unassigned: [],
        totalDistanceKm: 0,
        algorithm: "hungarian",
        executionTimeMs: 1,
      };
    }

    if (!deliveries.length) {
      return {
        assignments: [],
        unassigned: orders.map((order) => ({
          orderId: order.id,
          orderAddress: order.deliveryAddress,
          reason: "Sem entregadores disponíveis",
        })),
        totalDistanceKm: 0,
        algorithm: "hungarian",
        executionTimeMs: 1,
      };
    }

    const costMatrix = deliveries.map((delivery) =>
      orders.map((order) =>
        haversineDistance(
          Number(delivery.currentLatitude),
          Number(delivery.currentLongitude),
          Number(order.latitude),
          Number(order.longitude),
        ),
      ),
    );

    const munkres = new Munkres();

    const indexes = munkres.compute(costMatrix);

    const assignments = [];
    const assignedOrders = new Set<string>();

    for (const [deliveryIndex, orderIndex] of indexes) {
      const order = orders[orderIndex];

      if (!order) continue;

      const delivery = deliveries[deliveryIndex];

      const distance = costMatrix[deliveryIndex][orderIndex];

      assignments.push({
        orderId: order.id,
        deliveryPersonId: delivery.id,
        estimatedDistanceKm: Number(distance.toFixed(2)),
        orderAddress: order.deliveryAddress,
        deliveryPersonName: delivery.name,
      });

      assignedOrders.add(order.id);

      await this.orderRepository.assignDeliveryPerson(order.id, delivery.id);
      await this.orderRepository.updateStatus(order.id, OrderStatus.DELIVERING);
    }

    const unassigned = orders
      .filter((order) => !assignedOrders.has(order.id))
      .map((order) => ({
        orderId: order.id,
        orderAddress: order.deliveryAddress,
        reason: "Sem entregador disponível",
      }));

    const totalDistanceKm = assignments.reduce(
      (sum, a) => sum + a.estimatedDistanceKm,
      0,
    );

    const executionTimeMs = Number((performance.now() - start).toFixed(2));

    return {
      assignments,
      unassigned,
      totalDistanceKm,
      algorithm: "hungarian",
      executionTimeMs,
    };
  }
}
