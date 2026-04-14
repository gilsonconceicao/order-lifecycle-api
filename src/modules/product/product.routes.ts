import { Router } from "express";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./product.entity";
import { AppDataSource } from "../../infrastructure/database/data-source";
import { ProductRepository } from "./repositories/ProductRepository";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { OrderRepository } from "../order/repositories/OrderRepository";
import { Order } from "../order/order.entity";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema.middleware";
import { createProductSchema, updateProductSchema } from "./schemas/product.schema";

const router = Router();

const productRepository = new ProductRepository(
  AppDataSource.getRepository(Product),
);
const ordersRepository = new OrderRepository(
  AppDataSource.getRepository(Order),
);
const productService = new ProductService(productRepository, ordersRepository);
const productController = new ProductController(productService);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Cria um novo produto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [meal, drink, dessert,side]
 *               preparationTime:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: createProductSchema }),
  productController.create.bind(productController),
);

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Lista todos os produtos
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Nome do produto
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum:
 *             - meal
 *             - drink
 *             - dessert
 *             - side
 *         description: Categoria do produto
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Produto está disponível true ou false
 *     responses:
 *       200:
 *         description: Lista de produtos paginada
 */
router.get(
  "/",
  authMiddleware,
  productController.findAll.bind(productController),
);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Busca um produto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get(
  "/:id",
  authMiddleware,
  productController.findById.bind(productController),
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Atualiza um produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
*           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [meal, drink, dessert,side]
 *               preparationTime:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: updateProductSchema }),
  productController.update.bind(productController),
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Remove um produto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Produto não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  productController.delete.bind(productController),
);

export { router as productRoutes };
