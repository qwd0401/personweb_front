import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useTranslation } from 'react-i18next';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 68;
const APPBAR_HEIGHT = 64;

const Layout = () => {
  const muiTheme = useMuiTheme();
  const { toggleTheme, mode } = useCustomTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const { i18n } = useTranslation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const currentDrawerWidth = isDrawerCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { sm: `${currentDrawerWidth}px` },
          height: APPBAR_HEIGHT,
          backdropFilter: 'blur(8px)',
          backgroundColor: muiTheme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          borderBottom: `1px solid ${muiTheme.palette.divider}`,
          transition: muiTheme.transitions.create(['width', 'margin-left'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: APPBAR_HEIGHT, px: { xs: 2, sm: 3 } }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              width: 40,
              height: 40,
              borderRadius: 1.5,
              color: muiTheme.palette.text.primary,
              '&:hover': {
                backgroundColor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            to="/admin/login"
            startIcon={<LoginIcon />}
            sx={{
              minWidth: 40,
              height: 40,
              borderRadius: 1.5,
              color: muiTheme.palette.text.primary,
              mr: 2,
              '&:hover': {
                backgroundColor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            登录后台
          </Button>
          <Button
            onClick={toggleLanguage}
            sx={{
              minWidth: 40,
              height: 40,
              borderRadius: 1.5,
              color: muiTheme.palette.text.primary,
              mr: 2,
            }}
          >
            {i18n.language === 'zh' ? 'EN' : '中'}
          </Button>
          <IconButton
            onClick={toggleTheme} 
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              color: muiTheme.palette.text.primary,
              backgroundColor: muiTheme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.03)',
              '&:hover': {
                backgroundColor: muiTheme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {mode === 'dark' ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Navigation 
        mobileOpen={mobileOpen} 
        onClose={handleDrawerToggle}
        drawerWidth={DRAWER_WIDTH}
        collapsedWidth={DRAWER_COLLAPSED_WIDTH}
        isCollapsed={isDrawerCollapsed}
        onCollapse={handleDrawerCollapse}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, sm: `${currentDrawerWidth}px` },
          width: { xs: '100%', sm: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          pt: { xs: `${APPBAR_HEIGHT + 24}px`, sm: `${APPBAR_HEIGHT + 40}px` },
          pb: { xs: 4, sm: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          background: muiTheme.palette.background.default,
          transition: muiTheme.transitions.create(['margin-left', 'width'], {
            easing: muiTheme.transitions.easing.sharp,
            duration: muiTheme.transitions.duration.enteringScreen,
          }),
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 'lg',
            mx: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout; 