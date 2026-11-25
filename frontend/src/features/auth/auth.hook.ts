import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import authService from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { getAuthErrorMessage, logAuthFailure } from "@/features/auth/auth.utils";

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (response) => {
      console.info("[auth] login mutation succeeded");

      setAuth(
        response.data.user,
        response.data.accessToken,
        response.data.refreshToken
      );

      toast.success("Login Successful");
    },

    onError: (error: unknown) => {
      logAuthFailure("login mutation", error);
      toast.error(getAuthErrorMessage(error, "Login failed."));
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,

    onSuccess: () => {
      console.info("[auth] registration mutation succeeded");

      toast.success("Registration Successful");
    },

    onError: (error: unknown) => {
      logAuthFailure("registration mutation", error);
      toast.error(
        getAuthErrorMessage(error, "Registration failed.")
      );
    },
  });
};