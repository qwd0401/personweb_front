export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  outcome: string;
  github?: string;
  demo?: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
