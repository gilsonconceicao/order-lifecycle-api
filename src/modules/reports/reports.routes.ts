import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { ReportsRepository } from "./repositories/ReportsRepository";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { OrderItem } from "../orderItem/orderItem.entity";
import { Order } from "../order/order.entity";

const router = Router();

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);

const reportsRepository = new ReportsRepository(
  orderRepository,
  orderItemRepository
);

const reportsService = new ReportsService(reportsRepository);
const reportsController = new ReportsController(reportsService);

/**
 * @swagger
 * /reports/revenue:
 *   get:
 *     tags: [Reports]
 *     summary: Retorna o faturamento no período
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-03-01
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-03-21
 *     responses:
 *       200:
 *         description: Relatório de faturamento
 */
router.get(
  "/revenue",
  authMiddleware,
  reportsController.getRevenue.bind(reportsController)
);

/**
 * @swagger
 * /reports/orders-by-status:
 *   get:
 *     tags: [Reports]
 *     summary: Retorna quantidade de pedidos por status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Relatório de status dos pedidos
 */
router.get(
  "/orders-by-status",
  authMiddleware,
  reportsController.getOrdersByStatus.bind(reportsController)
);

/**
 * @swagger
 * /reports/top-products:
 *   get:
 *     tags: [Reports]
 *     summary: Retorna os produtos mais vendidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lista de produtos mais vendidos
 */
router.get(
  "/top-products",
  authMiddleware,
  reportsController.getTopProducts.bind(reportsController)
);

/**
 * @swagger
 * /reports/average-delivery-time:
 *   get:
 *     tags: [Reports]
 *     summary: Retorna métricas de tempo médio de entrega
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório de tempo médio de entrega
 */
router.get(
  "/average-delivery-time",
  authMiddleware,
  reportsController.getAverageDeliveryTime.bind(reportsController)
);

export {router as reportsRoutes};