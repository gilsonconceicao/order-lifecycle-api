import { Request } from "express"; 

export interface IUserContext extends Request {
  sub: string;
  role: string; 
  createdAt?: string;
  exp: number; 
  iat: number; 
}
