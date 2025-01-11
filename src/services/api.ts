import axios from 'axios';
import { Project, Blog, ContactForm } from '../types';

const API_BASE_URL = 'https://xnwdwpypqvgr.sealoshzh.site/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// 公开接口
export const getProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get('/projects');
  return response.data as Project[];
};

export const getBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get('/blogs');
  return response.data as Blog[];
};

export const sendContactMessage = async (data: ContactForm): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/contact', data);
  return response.data as { message: string };
};

// 管理员接口
export const adminLogin = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axiosInstance.post('/admin/login', credentials);
    console.log('Login response:', response.data);
    
    if (response.data.success) {
      if (!response.data.token) {
        throw new Error('No token received');
      }
      // 保存 token 到 localStorage
      localStorage.setItem('admin_token', response.data.token);
      // 设置 axios 默认 header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return {
        success: true,
        message: '登录成功'
      };
    }
    
    return {
      success: false,
      message: response.data.message || '登录失败'
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || '登录失败，请稍后重试'
    };
  }
};

// 添加 token 验证接口
export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get('/admin/verify-token');
    return response.data.success;
  } catch (error) {
    return false;
  }
};

export const adminCreateProject = async (project: Project) => {
  const response = await axiosInstance.post('/admin/projects', project);
  return response.data;
};

export const adminUpdateProject = async (id: string, project: Partial<Project>) => {
  const response = await axiosInstance.put(`/admin/projects/${id}`, project);
  return response.data;
};

export const adminDeleteProject = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/projects/${id}`);
  return response.data;
};

export const adminCreateBlog = async (blog: Blog) => {
  const response = await axiosInstance.post('/admin/blogs', blog);
  return response.data;
};

export const adminUpdateBlog = async (id: string, blog: Partial<Blog>) => {
  const response = await axiosInstance.put(`/admin/blogs/${id}`, blog);
  return response.data;
};

export const adminDeleteBlog = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/blogs/${id}`);
  return response.data;
};

export const adminGetMessages = async () => {
  const response = await axiosInstance.get('/admin/messages');
  return response.data;
}; 