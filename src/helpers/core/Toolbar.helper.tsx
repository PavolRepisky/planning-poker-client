import { screen, within } from 'test-utils';

export const getToolbar = () => screen.getByRole('toolbar');

export const getLogo = () =>
  within(getToolbar()).getByRole('img', {
    name: /logo/i,
  });

export const getSettingsButton = () =>
  within(getToolbar()).getByRole('button', { name: /settings$/i });
