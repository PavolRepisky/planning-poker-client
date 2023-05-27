import userEvent from '@testing-library/user-event';
import { screen, within } from 'test-utils';

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

export const fillUpForm = async (data: {
  matrixName: string;
}) => {
  await userEvent.type(nameInput(), data.name);

  await userEvent.click(matrixIdInput());

  const optionsList = screen.getByRole('listbox', {
    name: /session.dialog.create.form.matrixId.label/i,
  });

  const option = within(optionsList).getByRole('option', {
    name: data.matrixName,
  });

  await userEvent.click(option);
};
