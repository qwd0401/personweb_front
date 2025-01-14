import React from "react";
import { RouteObject, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import TechLearning from "./pages/TechLearning";
import Contact from "./pages/Contact";
import AdminLayout from "./pages/admin/AdminLayout";
import Login from "./pages/admin/Login";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminTechArticles from "./pages/admin/AdminTechArticles";
import AdminMessages from "./pages/admin/AdminMessages";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "projects", element: <Projects /> },
      { path: "tech-learning", element: <TechLearning /> },
      { path: "blog", element: <Navigate to="/tech-learning" replace /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "projects", element: <AdminProjects /> },
      { path: "tech-articles", element: <AdminTechArticles /> },
      { path: "messages", element: <AdminMessages /> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export default routes;
