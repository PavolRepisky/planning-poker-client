import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getEmailInput = () =>
  screen.getByRole('textbox', {
    name: 'auth.login.form.email.label',
  });

export const getPasswordInput = () =>
  document.querySelector("[name='password']")!;

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'auth.login.form.submit',
  });

export const exampleData = {
  email: 'john@doe.com',
  password: 'Password1',
};

export const fillUpForm = async (data: {
  email?: string;
  password?: string;
}) => {
  const emailInput = getEmailInput();
  const passwordInput = getPasswordInput();

  await userEvent.clear(emailInput);
  await userEvent.clear(passwordInput);

  if (data.email) await userEvent.type(emailInput, data.email);
  if (data.password) await userEvent.type(passwordInput, data.password);
};
