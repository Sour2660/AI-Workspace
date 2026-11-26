import axios from "axios";
import { storage } from "@/utils/storage";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 */
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken();

    console.info("[api] request", {
      url: `${config.baseURL}${config.url}`,
      method: config.method?.toUpperCase(),
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.info("[api] authorization token attached");
    }

    return config;
  },
  (error) => {
    console.error("[api] request setup failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => {
    console.info("[api] response", {
      url: response.config.url,
      status: response.status,
    });

    return response;
  },
  (error) => {
    console.error("[api] request failed", {
      url: error.config?.url,
      status: error.response?.status,
      code: error.code,
    });

    if (error.response?.status === 401) {
      storage.clear();

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;