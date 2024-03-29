import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import { createTheme } from 'core/theme';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface SettingsContextInterface {
  collapsed: boolean;
  direction: string;
  mode: string;
  open: boolean;
  changeCollapsed: (collapsed: boolean) => void;
  changeDirection: (direction: 'ltr' | 'rtl') => void;
  changeMode: (mode: string) => void;
  toggleDrawer: () => void;
}

export const SettingsContext = createContext({} as SettingsContextInterface);

type SettingsProviderProps = {
  children: React.ReactNode;
};

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [collapsed, setCollapsed] = useLocalStorage('sidebarcollapsed', false);
  const [direction, setDirection] = useLocalStorage('direction', 'ltr');
  const [mode, setMode] = useLocalStorage('mode', 'light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.dir = direction;
  }, [direction]);

  const theme = useMemo(
    () => createTheme(direction as 'ltr' | 'rtl', mode as 'dark' | 'light'),
    [direction, mode]
  );

  const changeCollapsed = (collapsed: boolean) => {
    if (typeof collapsed === 'boolean') {
      setCollapsed(collapsed);
    }
  };

  const changeDirection = (direction: 'ltr' | 'rtl') => {
    if (direction) {
      setDirection(direction);
    }
  };

  const changeMode = (mode: string) => {
    if (mode) {
      setMode(mode);
    }
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <SettingsContext.Provider
      value={{
        collapsed,
        direction,
        mode,
        open,
        changeCollapsed,
        changeDirection,
        changeMode,
        toggleDrawer,
      }}
    >
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};

export default SettingsProvider;
