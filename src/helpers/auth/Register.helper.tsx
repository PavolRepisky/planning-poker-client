import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getFirstNameInput = () =>
  screen.getByRole('textbox', {
    name: 'auth.register.form.firstName.label',
  });

export const getLastNameInput = () =>
  screen.getByRole('textbox', {
    name: 'auth.register.form.lastName.label',
  });

export const getEmailInput = () =>
  screen.getByRole('textbox', {
    name: 'auth.register.form.email.label',
  });

export const getPasswordInput = () =>
  document.querySelector("[name='password']")!;

export const getConfirmPasswordInput = () =>
  document.querySelector("[name='confirmationPassword']")!;

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'auth.register.form.submit',
  });

export const exampleData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@doe.com',
  password: 'Password1',
  confirmationPassword: 'Password1',
};

export const fillUpForm = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmationPassword?: string;
}) => {
  const firstNameInput = getFirstNameInput();
  const lastNameInput = getLastNameInput();
  const emailInput = getEmailInput();
  const passwordInput = getPasswordInput();
  const confirmationPassword = getConfirmPasswordInput();

  await userEvent.clear(firstNameInput);
  await userEvent.clear(lastNameInput);
  await userEvent.clear(emailInput);
  await userEvent.clear(passwordInput);
  await userEvent.clear(confirmationPassword);

  if (data.firstName) await userEvent.type(firstNameInput, data.firstName);
  if (data.lastName) await userEvent.type(lastNameInput, data.lastName);
  if (data.email) await userEvent.type(emailInput, data.email);
  if (data.password) await userEvent.type(passwordInput, data.password);
  if (data.confirmationPassword)
    await userEvent.type(confirmationPassword, data.confirmationPassword);
};
