import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

type SchemaType = {
  body?: ZodType;
};

export function validateSchemaMiddleware(schemas: SchemaType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message
        }))

        return res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Dados inválidos",
            details
          }
        })
      }

      next(error);
    }
  };
}
