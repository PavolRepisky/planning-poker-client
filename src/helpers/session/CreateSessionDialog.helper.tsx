import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const nameInput = () =>
  screen.getByRole('textbox', {
    name: 'session.dialog.create.form.name.label',
  });

export const matrixIdInput = () =>
  screen.getByRole('button', {
    name: /^session.dialog.create.form.matrixId.label/,
  });

export const createButton = () =>
  screen.getByRole('button', {
    name: 'session.dialog.create.form.submit',
  });

export const cancelButton = () =>
  screen.getByRole('button', {
    name: 'common.cancel',
  });

export const exampleData = {
  name: 'Example Session',
  matrixId: 1,
};