import axios from "axios";
import { LoginResponse, ApiResponse, Message } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Projects API
export const getProjects = () =>
  api.get("/api/projects").then((res) => res.data);
export const adminCreateProject = (project: any) =>
  api.post("/api/admin/projects", project).then((res) => res.data);
export const adminUpdateProject = (id: string, project: any) =>
  api.put(`/api/admin/projects/${id}`, project).then((res) => res.data);
export const adminDeleteProject = (id: string) =>
  api.delete(`/api/admin/projects/${id}`).then((res) => res.data);

// Blogs API
export const getBlogs = () => api.get("/api/blogs").then((res) => res.data);
export const adminCreateBlog = (blog: any) =>
  api.post("/api/admin/blogs", blog).then((res) => res.data);
export const adminUpdateBlog = (id: string, blog: any) =>
  api.put(`/api/admin/blogs/${id}`, blog).then((res) => res.data);
export const adminDeleteBlog = (id: string) =>
  api.delete(`/api/admin/blogs/${id}`).then((res) => res.data);

// Messages API
export const sendContactMessage = (message: any): Promise<ApiResponse<any>> =>
  api.post("/api/messages", message).then((res) => res.data);
export const adminGetMessages = (): Promise<ApiResponse<Message[]>> =>
  api.get("/api/admin/messages").then((res) => res.data);

// Auth API
export const verifyToken = () =>
  api
    .get("/api/admin/verify-token")
    .then(() => true)
    .catch(() => false);

export const adminLogin = async (credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await api.post("/api/admin/login", credentials);
    if (response.data.token) {
      localStorage.setItem("admin_token", response.data.token);
      return {
        success: true,
        message: "登录成功",
      };
    }
    return {
      success: false,
      message: response.data.message || "登录失败",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "登录失败，请稍后重试",
    };
  }
};

export default api;
