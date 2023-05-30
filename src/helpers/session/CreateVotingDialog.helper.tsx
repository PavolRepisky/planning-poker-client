import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getNameInput = () =>
  screen.getByRole('textbox', {
    name: 'session.dialog.createVoting.form.name.label',
  });

export const getDescriptionInput = () =>
  screen.getByRole('textbox', {
    name: 'session.dialog.createVoting.form.description.label',
  });

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'session.dialog.createVoting.form.submit',
  });

export const getCancelButton = () =>
  screen.getByRole('button', {
    name: 'common.cancel',
  });

export const exampleData = {
  name: 'Test voting name',
  description: 'Test voting description',
};

export const fillUpForm = async (data: {
  name?: string;
  description?: string;
}) => {
  const nameInput = getNameInput();
  const descriptioInput = getDescriptionInput();

  if (data.name) await userEvent.type(nameInput, data.name);
  if (data.description) await userEvent.type(descriptioInput, data.description);
};
