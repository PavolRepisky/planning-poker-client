import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const firstNameInput = () => {
  return screen.getByRole('textbox', {
    name: 'session.join.guest.form.firstName.label',
  });
};

export const lastNameInput = () => {
  return screen.getByRole('textbox', {
    name: 'session.join.guest.form.lastName.label',
  });
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'session.join.guest.form.submit',
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
