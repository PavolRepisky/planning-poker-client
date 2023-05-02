import { Box, Toolbar } from '@mui/material';
import { useAuth } from 'auth/contexts/AuthProvider';
import QueryWrapper from 'core/components/QueryWrapper';
import SettingsDrawer from 'core/components/SettingsDrawer';
import Sidebar from 'core/components/Sidebar';
import { useSettings } from 'core/contexts/SettingsProvider';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { userData } = useAuth();

  const { collapsed, open, toggleDrawer } = useSettings();

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  if (!userData) {
    return (
      <Box>
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={open}
        onDrawerToggle={toggleDrawer}
        onSettingsToggle={handleSettingsToggle}
      />

      <SettingsDrawer
        onDrawerToggle={handleSettingsToggle}
        open={settingsOpen}
      />

      <Box component="main" sx={{ flexGrow: 1, pb: 3, px: { xs: 3, sm: 6 } }}>
        <Toolbar />
        <QueryWrapper>
          <Outlet />
        </QueryWrapper>
      </Box>
    </Box>
  );
};

export default AppLayout;
