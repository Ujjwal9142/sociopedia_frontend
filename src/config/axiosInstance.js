import axios from "axios";
import { store } from "../main";
import { setLogout, setNotification } from "../state/index";

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_DEV_ENV_BACKEND
    : import.meta.env.VITE_PROD_ENV_BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      store.dispatch(setLogout());
      store.dispatch(
        setNotification({
          message: "Session expired, please login again.",
          status: true,
          type: "error",
        })
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
