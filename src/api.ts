import axios, { AxiosError } from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TechArticle } from "./types/api";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 添加请求拦截器
api.interceptors.request.use(
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

// 添加错误处理函数
const handleApiError = (error: AxiosError): string => {
  if (error.response) {
    // 服务器返回了错误响应
    const data = error.response.data as any;
    return data.message || "服务器错误";
  } else if (error.request) {
    // 请求已经发出，但没有收到响应
    return "无法连接到服务器";
  } else {
    // 发送请求时出现问题
    return "请求错误";
  }
};

// 添加响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = handleApiError(error);
    return Promise.reject(errorMessage);
  }
);

// 项目相关接口
export const projectApi = {
  getAll: () => api.get("/api/projects"),
  getById: (id: string) => api.get(`/api/projects/${id}`),
  create: (data: any) => api.post("/api/admin/projects", data),
  update: (id: string, data: any) => api.put(`/api/admin/projects/${id}`, data),
  delete: (id: string) => api.delete(`/api/admin/projects/${id}`),
};

// 博客相关接口
export const blogApi = {
  getAll: () => api.get<TechArticle[]>("/api/tech-articles"),
  getById: (id: string) => api.get<TechArticle[]>(`/api/tech-articles/${id}`),
  create: (data: Partial<TechArticle>) => api.post("/api/tech-articles", data),
  update: (id: string, data: Partial<TechArticle>) =>
    api.put(`/api/tech-articles/${id}`, data),
  delete: (id: string) => api.delete(`/api/tech-articles/${id}`),
};

// 联系相关接口
export const contactApi = {
  sendMessage: (data: any) => api.post("/api/contact", data),
  getMessages: () => api.get("/api/admin/messages"),
  deleteMessage: (id: string) => api.delete(`/api/admin/messages/${id}`),
};

// 管理员相关接口
export const adminApi = {
  login: (credentials: { username: string; password: string }) =>
    api.post("/api/admin/login", credentials),
  verifyToken: () => api.get("/api/admin/verify-token"),
};

export default api;
