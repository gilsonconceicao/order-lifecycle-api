import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../shared/errors/Error.helper";
import { IUserRepository } from "../users/repositories/IUserRepository";

const accessSecret = process.env.JWT_SECRET!;
const refreshSecret = process.env.JWT_REFRESH_SECRET!;
const jwrExpiresIn = process.env.JWT_EXPIRES_IN!;
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user)
      throw new AppError("USER_NOT_FOUND", "Usuário não encontrado", 404);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      throw new AppError(
        "INVALID_CREDENTIALS",
        "Email ou senha invalidos",
        401,
      );

    const payload = {
      sub: user.id,
      role: user.role,
      createdAt: user.createdAt,
    };

    const accessToken = await signMethodAsync(
      payload,
      jwrExpiresIn,
      accessSecret,
    );
    const refreshToken = await signMethodAsync(
      payload,
      refreshExpiresIn,
      refreshSecret,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    const payload = jwt.verify(refreshToken, refreshSecret) as jwt.JwtPayload;
    delete payload.exp;
    delete payload.iat;

    const accessToken = await signMethodAsync(
      payload,
      jwrExpiresIn,
      accessSecret,
    );
    const newRefreshToken = await signMethodAsync(
      payload,
      refreshExpiresIn,
      refreshSecret,
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}

async function signMethodAsync(
  payload: Object,
  expiresIn: string,
  keySecret: string,
) {
  //@ts-ignore
  return await jwt.sign(payload, keySecret, { expiresIn });
}
