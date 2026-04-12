import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_SECRET!;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Token de autenticação não informado.",
    });
  }

  const accessToken = String(authHeader)?.replaceAll('Bearer', '')?.trim(); 

  try {
    const payload = jwt.verify(accessToken, accessSecret);

    //@ts-ignore
    req.user = payload;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "unauthorized",
        message: "Token expirado. Faça login novamente.",
      });
    }

    return res.status(401).json({
      error: "unauthorized",
      message: "Token de autenticação inválido.",
    });
  }
}
