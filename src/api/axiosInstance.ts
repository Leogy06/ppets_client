import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
  withCredentials: true,
  responseType: "blob",
});

export default axiosInstance;
