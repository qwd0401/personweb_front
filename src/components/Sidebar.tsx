import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";

const menuItems = [
  {
    title: "首页",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    title: "项目功能",
    path: "/projects",
    icon: <CodeIcon />,
  },
  {
    title: "技术学习",
    path: "/tech-learning",
    icon: <SchoolIcon />,
  },
];

const Sidebar = () => {
  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
