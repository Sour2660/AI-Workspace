import api from "@/services/api";
import type { AxiosResponse } from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  async login(payload: LoginRequest) {
    console.info("[auth] login request started");

    const response: AxiosResponse<LoginResponse> =
      await api.post("/auth/login", payload);

    console.info("[auth] login request completed", {
      status: response.status,
    });

    return response.data;
  }

  async register(payload: RegisterRequest) {
    console.info("[auth] registration request started");

    const response: AxiosResponse<LoginResponse> = await api.post(
      "/auth/register",
      payload
    );

    console.info("[auth] registration request completed", {
      status: response.status,
    });

    return response.data;
  }

  async me() {
    console.info("[auth] profile request started");

    const response = await api.get("/users/me");

    console.info("[auth] profile request completed", {
      status: response.status,
    });

    return response.data;
  }

  async logout() {
    console.info("[auth] logout request started");

    const response = await api.post("/auth/logout");

    console.info("[auth] logout request completed", {
      status: response.status,
    });

    return response.data;
  }
}

export default new AuthService();