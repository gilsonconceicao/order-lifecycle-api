import { Request, Response, NextFunction } from "express";
import { OrderService } from "./order.service";
import { FindOptionsOrderValue } from "typeorm";
import { OrderStatus } from "@/shared/enums/OrderStatusts";

export class OrderController {
  constructor(private orderService: OrderService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await this.orderService.create(req.body);

      return res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query;

      const products = await this.orderService.findAll({
        limit: Number(query?.limit ?? 10),
        page: Number(query?.page ?? 0), 
        status: query?.status as OrderStatus,
        order_created_at: query?.order_created_at as FindOptionsOrderValue
      });

      return res.json(products);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const product = await this.orderService.findById(id as string);

      return res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.orderService.delete(id as string);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await this.orderService.updateOrderStatus(
        id as string,
        status,
      );
      return res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }
  /**
   * @description Permite Atribuir um entregador a um pedido
   */
  async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { deliveryPersonId } = req.body;
      const result = await this.orderService.assign(
        id as string,
        deliveryPersonId,
      );
      return res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Executa o algoritmo de otimizacao de atribuição
   */
  async optimizeAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.orderService.optimizeAssignment();

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
