import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getFirstNameInput = () =>
  screen.getByRole('textbox', {
    name: 'profile.info.form.firstName.label',
  });

export const getLastNameInput = () =>
  screen.getByRole('textbox', {
    name: 'profile.info.form.lastName.label',
  });

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'common.update',
  });

export const getResetButton = () =>
  screen.getByRole('button', {
    name: 'common.reset',
  });

export const exampleData = {
  firstName: 'John',
  lastName: 'Doe',
};

export const fillUpForm = async (data: {
  firstName?: string;
  lastName?: string;
}) => {
  const firstNameInput = getFirstNameInput();
  const lastNameInput = getLastNameInput();

  await userEvent.clear(firstNameInput);
  await userEvent.clear(lastNameInput);

  if (data.firstName) await userEvent.type(firstNameInput, data.firstName);
  if (data.lastName) await userEvent.type(lastNameInput, data.lastName);
};
