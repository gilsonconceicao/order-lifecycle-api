import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";

interface LoginRequest {
  email: string;
  password: string;
}

interface RefreshRequest {
  refreshToken: string;
}

export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * Autentica um usuario e retorna os tokens
   */

  public async login( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as LoginRequest;

      const authenticatedUser = await this.authService.login(email, password);

      res.json(authenticatedUser);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gera um novo access token a partir de um refresh token valido
   */
  public async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as RefreshRequest;

      const result = await this.authService.refresh(refreshToken);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
