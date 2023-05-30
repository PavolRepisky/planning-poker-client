import { screen } from 'test-utils';

export const getEditButton = () =>
  screen.getByRole('button', {
    name: 'common.edit',
  });

export const getDeleteButton = () =>
  screen.getByRole('button', {
    name: 'common.delete',
  });
