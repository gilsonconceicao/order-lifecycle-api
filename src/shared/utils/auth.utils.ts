import { Request } from "express";
import { IUserContext } from "../interfaces/IUserAuthenticated";
import jwt from "jsonwebtoken";

export const getContextUser = (req: Request): IUserContext => {
    //@ts-ignore
    return req?.user;
}

export const isAdmin = (user: IUserContext): boolean => {
    return Boolean(String(user?.role).toLowerCase() === 'admin')
}


export function generateValidToken(): string {
  //@ts-ignore
  return jwt.sign(
    {
      sub: "1",
      role: "ADMIN",
      createdAt: new Date(),
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    },
  );
}