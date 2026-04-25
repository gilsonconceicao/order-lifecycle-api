import { logger } from "@/config";
import { AppError } from "@/shared/errors/Error.helper";
import { removeSpecialCharacters } from "@/shared/utils";
import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof AppError) {
    logger.error({
      ...err,
      message: removeSpecialCharacters(err.message),
    });
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err?.details,
      },
    });
  }

  logger.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
      exceptionMessage: err?.message,
    },
  });
}

export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Rota ${req.method} ${req.originalUrl} não encontrada`,
    },
  });
}
