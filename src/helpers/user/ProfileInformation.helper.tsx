import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const firstNameInput = () =>
  screen.getByRole('textbox', {
    name: 'profile.info.form.firstName.label',
  });

export const lastNameInput = () =>
  screen.getByRole('textbox', {
    name: 'profile.info.form.lastName.label',
  });

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'common.update',
  });
};

export const resetButton = () => {
  return screen.getByRole('button', {
    name: 'common.reset',
  });
};

export const exampleData = {
  firstName: 'John',
  lastName: 'Doe',
};

export const fillUpForm = async (data: {
  firstName: string;
  lastName: string;
}) => {
  await userEvent.type(firstNameInput(), data.firstName);
  await userEvent.type(lastNameInput(), data.lastName);
};
