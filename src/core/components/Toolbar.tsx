import { Menu as MenuIcon } from '@mui/icons-material';
import { IconButton, Toolbar as MuiToolbar, Typography } from '@mui/material';
import { useSettings } from 'core/contexts/SettingsProvider';

type ToolbarProps = {
  children?: React.ReactNode;
  title?: string;
};

const Toolbar = ({ children, title }: ToolbarProps) => {
  const { toggleDrawer } = useSettings();

  return (
    <MuiToolbar sx={{ px: { xs: 3, sm: 6 } }} role='toolbar'>
      <IconButton
        color="inherit"
        edge="start"
        onClick={toggleDrawer}
        sx={{
          display: { lg: 'none' },
          marginRight: 2,
        }}
      >
        <MenuIcon />
      </IconButton>

      <Typography variant="h2" component="h1" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>

      {children}
    </MuiToolbar>
  );
};

export default Toolbar;
