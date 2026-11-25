import authRepository from "./auth.repository";
import {
  LoginInput,
  RegisterInput,
} from "./auth.validation";

import AppError from "../../errors/AppError";
import { hashPassword, comparePassword } from "../../utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

class AuthService {

  async logout(userId: string) {
  await authRepository.updateRefreshToken(userId, null);

  return {
    message: "Logout successful",
  };
}

  async register(data: RegisterInput) {
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.create({
      ...data,
      password: hashedPassword,
    });
   
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput) {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await comparePassword(
      data.password,
      user.password
    );

    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();