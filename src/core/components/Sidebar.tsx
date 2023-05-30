import {
  Home as HomeIcon,
  HowToVote as HowToVoteIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import Logo from 'core/components/Logo';
import { drawerCollapsedWidth, drawerWidth } from 'core/config/layout';
import { useTranslation } from 'react-i18next';
import { NavLink, Link as RouterLink, useLocation } from 'react-router-dom';

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onSettingsToggle: () => void;
};

export const menuItems = [
  {
    icon: HomeIcon,
    key: 'sidebar.menu.home',
    path: '/home',
  },
  {
    icon: StyleIcon,
    key: 'sidebar.menu.matrix',
    path: '/matrices',
  },
  {
    icon: HowToVoteIcon,
    key: 'sidebar.menu.session',
    path: '/sessions',
  },
];

const Sidebar = ({
  collapsed,
  mobileOpen,
  onDrawerToggle,
  onSettingsToggle,
}: SidebarProps) => {
  const { userData } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useTheme();

  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <IconButton
        component={RouterLink}
        to={'/home'}
        sx={{
          '&:hover': { background: 'transparent' },
          p: 4,
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          color: theme.palette.text.primary,
        }}
      >
        <Logo size={24} sx={{ mr: 1 }} />
        <Typography
          variant="h5"
          color="inherit"
          noWrap
          sx={{ mb: 1, display: collapsed ? 'none' : 'block' }}
        >
          {process.env.REACT_APP_NAME}
        </Typography>
      </IconButton>

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
                    mb: 1,
                  }
                : { mb: 1 }
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
          to={`/profile`}
          sx={
            location.pathname === '/profile' ||
            location.pathname === '/profile/password'
              ? {
                  backgroundColor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                  mb: 1,
                }
              : { mb: 1 }
          }
        >
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>

          {userData && (
            <ListItemText
              primary={`${userData.firstName} ${userData.lastName}`}
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
            primary={t('sidebar.menu.settings')}
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
        data-testid="sidebar"
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
