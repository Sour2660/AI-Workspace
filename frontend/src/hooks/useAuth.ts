import authService from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

export const useAuth = () => {
  const auth = useAuthStore();

  const login = async (data: LoginRequest, remember = true) => {
    const response = await authService.login(data);

    auth.login(
      response.data.user,
      response.data.accessToken,
      remember,
      response.data.refreshToken
    );

    return response.data;
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);

    auth.login(
      response.data.user,
      response.data.accessToken,
      true,
      response.data.refreshToken
    );

    return response.data;
  };

  const logout = () => {
    auth.logout();
  };

  const getProfile = async () => {
    const response = await authService.me();

    auth.setUser(response.data.data);

    return response.data;
  };

  return {
    ...auth,
    login,
    register,
    logout,
    getProfile,
  };
};