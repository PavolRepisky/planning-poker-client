import { screen, within } from 'test-utils';

export const getConfirmButton = () =>
  within(screen.getByRole('dialog')).getByRole('button', {
    name: 'common.confirm',
  });

export const getCancelButton = () =>
  within(screen.getByRole('dialog')).getByRole('button', {
    name: 'common.cancel',
  });
