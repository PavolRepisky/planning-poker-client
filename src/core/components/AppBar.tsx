import { AppBar as MuiAppBar } from '@mui/material';
import { drawerCollapsedWidth, drawerWidth } from 'core/config/layout';
import { useSettings } from 'core/contexts/SettingsProvider';

type AppBarProps = {
  children: React.ReactNode;
};

const AppBar = ({ children }: AppBarProps) => {
  const { collapsed } = useSettings();
  const width = collapsed ? drawerCollapsedWidth : drawerWidth;

  return (
    <MuiAppBar
      color="default"
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${width}px)` },
        marginLeft: { lg: width },
      }}
    >
      {children}
    </MuiAppBar>
  );
};

export default AppBar;
