import { Router } from "express";
import { OrderRepository } from "./repositories/OrderRepository";
import { AppDataSource } from "@/infrastructure/database/data-source";
import { DeliveryPersonRepository } from "../deliveryPerson/repositories/DeliveryPersonRepository";
import { Order } from "./order.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { DeliveryPerson } from "../deliveryPerson/deliveryPerson.entity";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema.middleware";
import { createOrderSchema, updateOrderSchema } from "./schemas/order.schema";
import { ProductRepository } from "../product/repositories/ProductRepository";
import { Product } from "../product/product.entity";
import { OrderItem } from "../orderItem/orderItem.entity";
import { OrderItemRepository } from "../orderItem/repositories/OrderRepository";

const router = Router();
const orderRepository = new OrderRepository(AppDataSource.getRepository(Order));
const deliveryPersonRepository = new DeliveryPersonRepository(AppDataSource.getRepository(DeliveryPerson));
const productReporitory = new ProductRepository(AppDataSource.getRepository(Product));
const orderItemRepository = new OrderItemRepository(AppDataSource.getRepository(OrderItem));

const orderService = new OrderService(
  orderRepository,
  deliveryPersonRepository,
  productReporitory, 
  orderItemRepository
);
const orderController = new OrderController(orderService);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Cria um novo pedido
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               customerPhone:
 *                 type: string
 *               deliveryAddress:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               deliveryPersonId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: createOrderSchema }),
  orderController.create.bind(orderController),
);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lista todos os pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Página atual
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Quantidade de itens por página
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - preparing
 *             - ready
 *             - delivering
 *             - delivered
 *             - cancelled
 *         description: Filtra pedidos pelo status
 *       - in: query
 *         name: order_created_at
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *           default: DESC
 *         description: Ordenação pela data de criação do pedido
 *     responses:
 *       200:
 *         description: Lista de pedidos paginada
 */
router.get("/", authMiddleware, orderController.findAll.bind(orderController));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Busca um pedido por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente ADMIN)
 *       404:
 *         description: Pedido não encontrado
 */
router.get(
  "/:id",
  authMiddleware,
  orderController.findById.bind(orderController),
);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Remove um pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Pedido removido com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente ADMIN)
 *       404:
 *         description: Pedido não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  orderController.delete.bind(orderController),
);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Atualiza o status de um pedido
 *     description: Permite que um admin altere o status de um pedido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, ready, delivering, delivered, cancelled]
 *                 example: preparing
 *                 description: Novo status do pedido
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente ADMIN)
 *       404:
 *         description: Pedido não encontrado
 */
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  orderController.updateStatus.bind(orderController),
);

/**
 * @swagger
 * /orders/{id}/assign:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Atribui um entregador a um pedido
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do pedido
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryPersonId
 *             properties:
 *               deliveryPersonId:
 *                 type: string
 *                 description: id do entregador
 *     responses:
 *       200:
 *         description: entregador adicionado ao pedido com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente ADMIN)
 *       404:
 *         description: Pedido não encontrado
 */
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("ADMIN"),
  orderController.assign.bind(orderController),
);

/**
 * @swagger
 * /orders/optimize-assignment:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Executa o algoritmo de otimizacao de atribuição
 *     security:
 *       - bearerAuth: []
 *     description: Busca pedidos com prontos e entregadores disponíveis e executa algoritmo Hungarian para otimizar as entregas.
 *     responses:
 *       200:
 *         description: Resultado da otimização
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       deliveryPersonId:
 *                         type: string
 *                       estimatedDistanceKm:
 *                         type: number
 *                       orderAddress:
 *                         type: string
 *                       deliveryPersonName:
 *                         type: string
 *                 unassigned:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       orderAddress:
 *                         type: string
 *                       reason:
 *                         type: string
 *                 totalDistanceKm:
 *                   type: number
 *                 algorithm:
 *                   type: string
 *                 executionTimeMs:
 *                   type: number
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Acesso negado (somente ADMIN)
 */
router.post(
  "/optimize-assignment",
  authMiddleware,
  roleMiddleware("ADMIN"),
  orderController.optimizeAssignment.bind(orderController),
);

export { router as orderRoutes };
