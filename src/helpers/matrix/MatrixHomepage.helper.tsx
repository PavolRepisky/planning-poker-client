import { getToolbar } from 'helpers/core/Toolbar.helper';
import { screen, within } from 'test-utils';

export const getAddButton = () =>
  within(getToolbar()).getByRole('button', {
    name: 'matrix.dialog.add.action',
  });

export const getActionsButton = (index: number) =>
  screen.getAllByTestId('MoreVertIcon')[index];

export const getDeleteAction = () =>
  screen.getByRole('menuitem', {
    name: 'common.delete',
  });

export const getEditAction = () =>
  screen.getByRole('menuitem', {
    name: 'common.edit',
  });

export const getViewAction = () =>
  screen.getByRole('menuitem', {
    name: 'common.view',
  });
