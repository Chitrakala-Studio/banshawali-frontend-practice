import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === "string" &&
      error.response.data.toLowerCase().includes("expired token")
    ) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
