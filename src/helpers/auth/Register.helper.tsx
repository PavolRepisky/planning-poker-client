import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const firstNameInput = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.firstName.label',
  });
};

export const lastNameInput = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.lastName.label',
  });
};

export const emailInput = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.email.label',
  });
};

export const passwordInput = () => {
  return document.querySelector("[name='password']")!;
};

export const confirmationPasswordInput = () => {
  return document.querySelector("[name='confirmationPassword']")!;
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.register.form.submit',
  });
};

export const exampleData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  password: 'Password1',
  confirmationPassword: 'Password1',
};

export const fillUpForm = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmationPassword: string;
}) => {
  await userEvent.type(firstNameInput(), data.firstName);
  await userEvent.type(lastNameInput(), data.lastName);
  await userEvent.type(emailInput(), data.email);
  await userEvent.type(passwordInput(), data.password);
  await userEvent.type(confirmationPasswordInput(), data.confirmationPassword);
};
