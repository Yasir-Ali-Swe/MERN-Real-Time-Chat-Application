import axios from "axios";
import Store from "@/store/store";
import { setAccessToken, logout } from "../features/auth/authSlice";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = Store.getState().auth.accessToken;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        Store.dispatch(setAccessToken(response.data?.accessToken));
        originalRequest.headers["Authorization"] =
          `Bearer ${response.data?.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        Store.dispatch(logout());
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
