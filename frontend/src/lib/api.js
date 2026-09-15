import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("engageflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401)
      localStorage.removeItem("engageflow_token");
    return Promise.reject(error);
  }
);

export const getApiError = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export default api;
