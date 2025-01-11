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