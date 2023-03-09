import {
  Groups as GroupsIcon,
  HelpCenter as HelpCenterIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Drawer,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import Logo from 'core/components/Logo';
import { drawerCollapsedWidth, drawerWidth } from 'core/config/layout';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsToggle: () => void;
};

export const menuItems = [
  {
    icon: HomeIcon,
    key: 'admin.drawer.menu.home',
    path: '/home',
  },
  {
    icon: StyleIcon,
    key: 'admin.drawer.menu.matrixManagement',
    path: '/matrices',
  },
  {
    icon: GroupsIcon,
    key: 'admin.drawer.menu.sessionManagement',
    path: '/sessions',
  },
  {
    icon: HelpCenterIcon,
    key: 'admin.drawer.menu.help',
    path: '/help',
  },
];

const Sidebar = ({
  collapsed,
  mobileOpen,
  onDrawerToggle,
  onSettingsToggle,
}: SidebarProps) => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();

  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <Logo sx={{ display: 'flex', p: 4 }} />
      <List component="nav" sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            component={NavLink}
            key={item.path}
            end={true}
            to={item.path}
            sx={
              location.pathname === item.path
                ? {
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                  }
                : {}
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ color: 'inherit', bgcolor: 'transparent' }}>
                <item.icon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t(item.key)}
              sx={{
                display: collapsed ? 'none' : 'block',
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <List component="nav" sx={{ p: 2 }}>
        <ListItemButton
          component={NavLink}
          to={`/admin/profile`}
          sx={
            location.pathname === '/admin/profile'
              ? {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                }
              : {}
          }
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          {userInfo && (
            <ListItemText
              primary={`${userInfo.firstName} ${userInfo.lastName}`}
              sx={{
                display: collapsed ? 'none' : 'block',
              }}
            />
          )}
        </ListItemButton>
        <ListItemButton onClick={onSettingsToggle}>
          <ListItemAvatar>
            <Avatar>
              <SettingsIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t('admin.drawer.menu.settings')}
            sx={{
              display: collapsed ? 'none' : 'block',
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box
      aria-label="Admin drawer"
      component="nav"
      sx={{
        width: { lg: width },
        flexShrink: { lg: 0 },
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
