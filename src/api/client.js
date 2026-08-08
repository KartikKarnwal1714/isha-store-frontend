import axios from "axios";
import { API_URL } from "../utils/apiUrl";

const api = axios.create({
  baseURL: API_URL,

  timeout: 15000,

  headers: {
    "Content-Type":
      "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const customerToken =
      localStorage.getItem(
        "customerToken"
      );

    if (customerToken) {
      config.headers.Authorization =
        `Bearer ${customerToken}`;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem(
        "customerToken"
      );

      localStorage.removeItem(
        "customer"
      );

      const currentPath =
        window.location.pathname;

      if (
        currentPath !== "/login"
      ) {
        window.location.href =
          "/login";
      }
    }

    if (
      error.response?.status === 403
    ) {
      console.error(
        error.response?.data?.message ||
          "Permission denied"
      );
    }

    if (!error.response) {
      console.error(
        "Network error: Backend server may not be running."
      );
    }

    return Promise.reject(error);
  }
);

export default api;