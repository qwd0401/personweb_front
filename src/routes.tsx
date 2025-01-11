import { RouteObject } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminMessages from './pages/admin/AdminMessages';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'projects',
        element: <AdminProjects />,
      },
      {
        path: 'blogs',
        element: <AdminBlogs />,
      },
      {
        path: 'messages',
        element: <AdminMessages />,
      },
    ],
  },
];

export default routes; 