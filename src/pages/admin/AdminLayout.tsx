import { useState, useEffect, ReactNode } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
  Button,
  ListItemButton,
  CircularProgress,
  Card,
} from "@mui/material";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import { verifyToken } from "../../services/api";

const DRAWER_WIDTH = 240;

interface AdminCardProps {
  children: ReactNode;
  sx?: any; // 或者使用更具体的 MUI 类型
  [key: string]: any; // 允许其他 props
}

const AdminLayout = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // 检查登录状态
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const isValid = await verifyToken();
      if (!isValid) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login", { replace: true });
      }
      setIsVerifying(false);
    };

    checkAuth();
  }, [navigate]);

  if (isVerifying) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  const menuItems = [
    { text: "项目管理", icon: <DashboardIcon />, path: "/admin/projects" },
    { text: "技术文章", icon: <SchoolIcon />, path: "/admin/tech-articles" },
    { text: "博客管理", icon: <ArticleIcon />, path: "/admin/blogs" },
    { text: "消息管理", icon: <EmailIcon />, path: "/admin/messages" },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6200EA 0%, #B388FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          管理后台
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              cursor: "pointer",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            sx={{
              mr: 2,
              color: "text.primary",
              "&:hover": {
                bgcolor: "action.hover",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s",
            }}
          >
            返回主页
          </Button>
          <Tooltip title="退出登录">
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ color: "text.primary" }}
            >
              退出
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "background.paper",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "background.paper",
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          bgcolor: "background.default",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)"
              : "linear-gradient(to bottom right, #f8f9fa, #ffffff)",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export const AdminCard = ({ children, ...props }: AdminCardProps) => (
  <Card
    elevation={0}
    {...props}
    sx={{
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      bgcolor: "background.paper",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "primary.main",
        transform: "translateY(-2px)",
        boxShadow: (theme) =>
          `0 4px 20px ${
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.4)"
              : "rgba(0,0,0,0.1)"
          }`,
      },
      ...props.sx,
    }}
  >
    {children}
  </Card>
);

export default AdminLayout;
