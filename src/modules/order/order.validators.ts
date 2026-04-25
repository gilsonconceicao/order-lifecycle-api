import { isOrderStatus } from "@/shared/utils";
import {
  OrderStatus,
  orderStatusTransition,
} from "../../shared/enums/OrderStatusts";
import { AppError } from "../../shared/errors/Error.helper";
import { Order } from "./order.entity";
import { Product } from "../product/product.entity";
import { order_logger } from "@/config";

export const validateOrderStatusUpdate = (
  order: Order,
  newStatus: OrderStatus,
) => {
  const allowedTransitions = orderStatusTransition[order.status];
  if (!isOrderStatus(newStatus)) {
    order_logger.error(`[UpdateStatus] - status ${String(newStatus)} is not exists`);
    throw new AppError(
      "ORDER_STATUS_INVALID",
      `O status do pedido informado (${String(newStatus)}) não existe.`,
      422,
      {
        StatusAvailable: Object.values(OrderStatus),
      },
    );
  }

  if (order.status === newStatus) {
    order_logger.error(`[UpdateStatus] - status are the same`);
    throw new AppError(
      "ORDER_STATUS_ALREADY_EXISTS",
      `O pedido já está com o status '${newStatus}'.`,
      400,
    );
  }

  if (!allowedTransitions.includes(newStatus)) {
    order_logger.error(`[UpdateStatus] - invalid status tranistion from ${order.status} to ${newStatus}`);
    throw new AppError(
      "INVALID_STATUS_TRANSITION",
      `Não é possível alterar o status de '${order.status}' para '${newStatus}'.`,
      422,
      {
        allowedTransitions,
      },
    );
  }

  if (
    order.status === OrderStatus.READY &&
    newStatus === OrderStatus.DELIVERING &&
    order.deliveryPersonId === null
  ) {
    order_logger.error(`[UpdateStatus] - not possible change status to ${String(newStatus)} when there are no delivery men available`);

    throw new AppError(
      "ORDER_STATUS_INVALID",
      `Não é possível alterar o status do pedido para ${String(newStatus)} sem um entregador atribuído.`,
      400,
      {
        StatusAvailable: Object.values(OrderStatus),
      },
    );
  }
};

export const validateOrderCreate = (
  products: Product[],
  productIds: string[],
) => {
  const productNotFoundsIds = productIds.filter(
    (productId) => !products.map((p) => p.id).includes(productId),
  );

  if (productNotFoundsIds.length > 0) {
    order_logger.error(`[Create] - not possible create product. ${productNotFoundsIds.length} product(s) not found`);
    throw new AppError(
      "ORDER_INVALID",
      `Não foi possível criar o pedido. ${productNotFoundsIds.length} produto(s) não encontrado(s): ${productNotFoundsIds.join(", ")}`,
      400,
      { productNotFoundsIds },
    );
  }

  const inactiveProducts = products.filter((p) => !p.isAvailable);
  if (inactiveProducts.length > 0) {
    order_logger.error(`[Create] - not possible create product. ${productNotFoundsIds.length} product(s) not found`);
    
    throw new AppError(
      "UNAVAILABLE_PRODUCT",
      "Um ou mais produtos não estão disponiveis",
      422,
      {
        inactiveProductIds: inactiveProducts.map((p) => {
          return {
            productName: p.name,
            productId: p.id,
            reason: "Produto indisponivel",
          };
        }),
      },
    );
  }
};
