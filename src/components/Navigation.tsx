import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, useTheme, IconButton, Tooltip, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  mobileOpen: boolean;
  onClose: () => void;
  drawerWidth: number;
  collapsedWidth: number;
  isCollapsed: boolean;
  onCollapse: () => void;
}

const menuItems = [
  { text: 'nav.home', path: '/', icon: <HomeOutlinedIcon /> },
  { text: 'nav.projects', path: '/projects', icon: <WorkOutlineOutlinedIcon /> },
  { text: 'nav.blog', path: '/blog', icon: <ArticleOutlinedIcon /> },
  { text: 'nav.contact', path: '/contact', icon: <MailOutlineOutlinedIcon /> },
];

const Navigation = ({ 
  mobileOpen, 
  onClose, 
  drawerWidth, 
  collapsedWidth,
  isCollapsed,
  onCollapse 
}: NavigationProps) => {
  const theme = useTheme();
  const location = useLocation();
  const { t } = useTranslation();

  const drawerContent = (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: 2,
      }}
      role="navigation"
    >
      <Box sx={{ px: isCollapsed ? 1 : 3, mb: 4 }}>
        {!isCollapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('nav.website')}
          </Typography>
        )}
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text}
            title={isCollapsed ? t(item.text) : ''}
            placement="right"
            arrow
            disableHoverListener={!isCollapsed}
            disableFocusListener={!isCollapsed}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={onClose}
              tabIndex={0}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                minHeight: 44,
                justifyContent: isCollapsed ? 'center' : 'initial',
                px: 2.5,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: isCollapsed ? 0 : 36,
                  mr: isCollapsed ? 0 : 2,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={t(item.text)}
                  primaryTypographyProps={{
                    fontSize: '0.9375rem',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2 }}>
        <IconButton
          onClick={onCollapse}
          sx={{
            width: 36,
            height: 36,
            color: theme.palette.primary.main,
            '& svg': {
              fontSize: 20,
            },
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ 
          keepMounted: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            width: isCollapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        ModalProps={{
          disableEnforceFocus: true,
          disableRestoreFocus: true
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation; 