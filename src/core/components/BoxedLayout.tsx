import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Breakpoint,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import SettingsDrawer from './SettingsDrawer';

type BoxedLayoutProps = {
  title?: string;
  children: React.ReactNode;
  maxWidth?: Breakpoint;
};

const BoxedLayout = ({ title, children, maxWidth }: BoxedLayoutProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  return (
    <React.Fragment>
      <AppBar color="transparent" position="relative">
        <Toolbar>
          <Typography component="h1" variant="h4">
            {title}
          </Typography>
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
      <Container component="main" maxWidth={maxWidth ?? false}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
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
    </React.Fragment>
  );
};

export default BoxedLayout;
