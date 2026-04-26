import { Router } from "express";
import { HealthController } from "./health.controller";

const router = Router();
const healthController = new HealthController(); 


/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verifica saúde da API
 *     responses:
 *       200:
 *         description: Ok
 */
router.get("/", healthController.check.bind(healthController)); 

/**
 * @swagger
 * /health/check-smtp-connection:
 *   get:
 *     tags: [Health]
 *     summary: verifica se o serviço de SMTP está ok
 *     responses:
 *       200:
 *         description: Ok
 */
router.get("/check-smtp-connection", healthController.checkSmtpConnection.bind(healthController)); 

export {
  router as healthRoutes
}