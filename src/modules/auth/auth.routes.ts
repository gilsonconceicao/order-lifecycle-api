import { AppDataSource } from "@/infrastructure/database/data-source";
import { Router } from "express";
import { UserRepository } from "../users/repositories/UserRepository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User } from "../users/user.entity";
import { authMiddleware, roleMiddleware, validateSchemaMiddleware } from "@/middlewares";
import { createUserSchema } from "../users/schemas/create.user.schema";

const router = Router();

const typeOrmRepo = AppDataSource.getRepository(User);

const userRepository = new UserRepository(typeOrmRepo);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * tags:
 *   - name: Auth
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens de acesso e refresh
 */
router.post("/login", authController.login.bind(authController));

/**
 * @swagger
 * /auth/create-user:
 *   post:
 *     tags: [Auth]
 *     summary: Cria um novo usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, viewer]
 *                 example: admin
 *                 description: Determina  o nível de permissão do usuário
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post(
  "/create-user",
  authMiddleware,
  roleMiddleware("ADMIN"),
  validateSchemaMiddleware({ body: createUserSchema }),
  authController.create.bind(authController),
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Atualiza o token de acesso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Novo token de acesso
 */
router.post("/refresh", authController.refresh.bind(authController));

export { router as authRoutes };
