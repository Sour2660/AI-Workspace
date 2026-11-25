import axios from "axios";

interface ApiErrorResponse {
  message?: unknown;
}

export const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
};

export const logAuthFailure = (action: string, error: unknown) => {
  console.error(`[auth] ${action} failed`, {
    status: axios.isAxiosError(error) ? error.response?.status : undefined,
    code: axios.isAxiosError(error) ? error.code : undefined,
  });
};
