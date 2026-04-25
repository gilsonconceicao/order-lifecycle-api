
import { getContextUser } from "@/shared/utils";
import { Request, Response, NextFunction } from "express";

export function roleMiddleware(role: string) {

  return (req: Request, res: Response, next: NextFunction) => {
    const user = getContextUser(req);
    if (!user)
      return res.status(401).json({ message: "Unauthorized" });

    if (String(user.role).toLowerCase() !== role?.toLowerCase()){
      return res.status(403).json({ message: "Usuário não possui permissão suficiente para esse recurso" });
    }
    next();
  };
}