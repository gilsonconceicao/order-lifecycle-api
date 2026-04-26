import { logger } from "@/config";
import { transporterSmtp } from "@/integrations/smtp/setting";
import { AppError } from "@/shared/errors/Error.helper";
import { Request, Response, NextFunction } from "express";

export class HealthController {
  constructor() {}

  async check(req: Request, res: Response, next: NextFunction) {
    res.status(200).json({
      status: "UP",
      timestamp: new Date().toISOString(),
    });
  }

  async checkSmtpConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await transporterSmtp.verify();
      logger.info("SMTP: Server is ready to take our messages");
      return res.status(200).json({
        status: "OK",
        response
      });
    } catch (err) {
      logger.error(`SMTP: Verification failed: ${err}`);
      throw new AppError(
        "DELIVERY_PERSON_NOT_FOUND",
        `SMTP: Verification failed: ${err}`,
        400,
      );
    }
  }
}
