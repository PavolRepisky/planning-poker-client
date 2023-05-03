import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Breakpoint,
  Container,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import Logo from 'core/components/Logo';
import SettingsDrawer from 'core/components/SettingsDrawer';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type BoxedLayoutProps = {
  children: React.ReactNode;
  maxWidth?: Breakpoint;
  showLogo?: boolean;
};

const BoxedLayout = ({ children, maxWidth, showLogo }: BoxedLayoutProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <Box component={Paper} height={'100vh'}>
      <AppBar color="transparent" position="relative">
        <Toolbar>
          {showLogo && (
            <IconButton
              component={RouterLink}
              to={'/login'}
              sx={{ '&:hover': { background: 'transparent' } }}
            >
              <Logo size={24} sx={{ mr: 1 }} />
              <Typography variant="h5" color="inherit" noWrap sx={{ mb: 1 }}>
                {process.env.REACT_APP_NAME}
              </Typography>
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            aria-label="settings"
            component="span"
            onClick={handleSettingsToggle}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth={maxWidth ?? false}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
          <Box>
            <SettingsDrawer
              onDrawerToggle={handleSettingsToggle}
              open={settingsOpen}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BoxedLayout;
