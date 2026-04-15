import { Router } from "express";
import { DeliveryPersonService } from "./deliveryPerson.service";
import { DeliveryPersonController } from "./deliveryPerson.controller";
import { DeliveryPerson } from "./deliveryPerson.entity";
import { DeliveryPersonRepository } from "./repositories/DeliveryPersonRepository";
import { AppDataSource } from "@/infrastructure/database/data-source";
import { authMiddleware, roleMiddleware } from "@/middlewares";
import { validateSchemaMiddleware } from "@/middlewares/validateSchema.middleware";
import {
  createDeliveryPersonSchema,
  updateDeliveryPersonSchema,
} from "./schemas/deliveryPerson.schema";

const router = Router();

const typeOrmRepo = AppDataSource.getRepository(DeliveryPerson);

const deliveryPersonRepository = new DeliveryPersonRepository(typeOrmRepo);
const deliveryPersonService = new DeliveryPersonService(
  deliveryPersonRepository,
);
const deliveryPersonController = new DeliveryPersonController(
  deliveryPersonService,
);

/**
 * @swagger
 * /delivery-persons:
 *   post:
 *     tags: [DeliveryPersons]
 *     summary: Cria um novo entregador
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - vehicleType
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *                 enum: [bicycle, motorcycle, car]
 *               currentLatitude:
 *                 type: number
 *               currentLongitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Entregador criado com sucesso
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: createDeliveryPersonSchema }),
  deliveryPersonController.create.bind(deliveryPersonController),
);

/**
 * @swagger
 * /delivery-persons:
 *   get:
 *     tags: [DeliveryPersons]
 *     summary: Lista todos os entregadores
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
 *     responses:
 *       200:
 *         description: Lista de entregadores
 */
router.get(
  "/",
  authMiddleware,
  deliveryPersonController.findAll.bind(deliveryPersonController),
);

/**
 * @swagger
 * /delivery-persons/{id}:
 *   get:
 *     tags: [DeliveryPersons]
 *     summary: Busca um entregador por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do entregador
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entregador encontrado
 *       404:
 *         description: Entregador não encontrado
 */
router.get(
  "/:id",
  authMiddleware,
  deliveryPersonController.findById.bind(deliveryPersonController),
);

/**
 * @swagger
 * /delivery-persons/{id}:
 *   put:
 *     tags: [DeliveryPersons]
 *     summary: Atualiza um entregador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do entregador
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
 *               phone:
 *                 type: string
 *               vehicleType:
 *                 type: string
 *                 enum: [bicycle, motorcycle, car]
 *               currentLatitude:
 *                 type: number
 *               currentLongitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Entregador atualizado
 *       404:
 *         description: Entregador não encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: updateDeliveryPersonSchema }),
  deliveryPersonController.update.bind(deliveryPersonController),
);

/**
 * @swagger
 * /delivery-persons/{id}:
 *   delete:
 *     tags: [DeliveryPersons]
 *     summary: Remove um entregador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do entregador
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Entregador removido com sucesso
 *       404:
 *         description: Entregador não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deliveryPersonController.delete.bind(deliveryPersonController),
);

export { router as deliveryPersonsRoutes };
