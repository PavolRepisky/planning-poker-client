import { createTheme as createMuiTheme } from '@mui/material';
import { createThemeComponents } from 'core/theme/components';
import mixins from 'core/theme/mixins';
import { darkPalette, lightPalette } from 'core/theme/palette';
import shape from 'core/theme/shape';
import transitions from 'core/theme/transitions';
import typography from 'core/theme/typography';

export const createTheme = (
  direction: 'ltr' | 'rtl',
  mode: 'dark' | 'light'
) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  const baseTheme = createMuiTheme({
    direction,
    mixins,
    palette,
    shape,
    transitions,
    typography,
  });

  return createMuiTheme(
    {
      components: createThemeComponents(baseTheme),
    },
    baseTheme
  );
};
