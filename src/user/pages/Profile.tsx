import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Avatar, Box, Fab, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import AppBar from 'core/components/AppBar';
import QueryWrapper from 'core/components/QueryWrapper';
import Toolbar from 'core/components/Toolbar';
import { useSnackbar } from 'core/contexts/SnackbarProvider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const profileMenuItems = [
  {
    key: 'profile.menu.info',
    path: '',
  },
  {
    key: 'profile.menu.password',
    path: './password',
  },
];

const Profile = () => {
  const { logout, userData } = useAuth();
  const snackbar = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTab, setCurrentTab] = React.useState(
    !location.pathname.includes('/password') ? 0 : 1
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch {
      snackbar.error(t('common.errors.unexpected.subTitle'));
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar>
          <Fab aria-label="logout" color="secondary" onClick={handleLogout}>
            <ExitToAppIcon />
          </Fab>
        </Toolbar>
      </AppBar>

      <Grid container spacing={6}>
        <Grid item xs={12} md={4} marginTop={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              height: '100%',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                mb: 3,
                mt: { xs: 0, md: 14 },
                height: 160,
                width: 160,
              }}
            >
              <PersonIcon sx={{ fontSize: 120 }} />
            </Avatar>

            <Typography
              component="div"
              variant="h4"
            >{`${userData?.firstName} ${userData?.lastName}`}</Typography>
            <Typography component="p">{`${userData?.email}`}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} marginTop={3}>
          <Box sx={{ mb: 4 }}>
            <Tabs
              aria-label="profile nav tabs"
              value={currentTab}
              onChange={handleTabChange}
              TabIndicatorProps={{
                style: { display: 'none' },
              }}
            >
              {profileMenuItems.map((item, index) => (
                <Tab
                  key={item.key}
                  value={index}
                  end={true}
                  component={NavLink}
                  label={t(item.key)}
                  to={item.path}
                />
              ))}
            </Tabs>
          </Box>
          <QueryWrapper>
            <Outlet />
          </QueryWrapper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;
