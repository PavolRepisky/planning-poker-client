import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import Footer from 'core/components/Footer';
import Logo from 'core/components/Logo';
import SettingsDrawer from 'core/components/SettingsDrawer';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

type LandingLayoutProps = {
  children: React.ReactNode;
};

const LandingLayout = ({ children }: LandingLayoutProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { t } = useTranslation();

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Paper square>
      <AppBar color="transparent" position="relative">
        <Toolbar role="toolbar">
          <IconButton
            component={RouterLink}
            to={'/'}
            sx={{ '&:hover': { background: 'transparent' } }}
            role="img"
            aria-label="Logo"
          >
            <Logo size={24} sx={{ mr: 1 }} />
            <Typography variant="h5" color="inherit" noWrap sx={{ mb: 1 }}>
              {process.env.REACT_APP_NAME}
            </Typography>
          </IconButton>

          <Box sx={{ flexGrow: 1 }}></Box>

          <Button
            color="secondary"
            component={RouterLink}
            to={'/register'}
            variant="contained"
          >
            {t('common.register')}
          </Button>

          <Button
            color="secondary"
            component={RouterLink}
            to={'/login'}
            variant="contained"
          >
            {t('common.login')}
          </Button>

          <IconButton
            color="default"
            aria-label={t('common.settings')}
            component="span"
            onClick={handleSettingsToggle}
          >
            <SettingsIcon />
          </IconButton>

          <SettingsDrawer
            onDrawerToggle={handleSettingsToggle}
            open={settingsOpen}
          />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
      <Footer />
    </Paper>
  );
};

export default LandingLayout;
