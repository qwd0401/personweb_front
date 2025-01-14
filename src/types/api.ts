// 项目接口类型
export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  outcome: string;
  createdAt: string;
  updatedAt: string;
}

// 博客接口类型
export interface Blog {
  _id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 联系消息类型
export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// 管理员类型
export interface Admin {
  _id: string;
  username: string;
}

// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface TechArticle {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  difficulty: "入门" | "进阶" | "高级";
  tags: string[];
  resources: string[];
  createdAt: string;
  updatedAt: string;
}

// 修改 API 调用的返回类型
export const blogApi = {
  getAll: () => api.get<ApiResponse<TechArticle[]>>("/api/tech-articles"),
  // ... 其他方法也需要相应修改
};
