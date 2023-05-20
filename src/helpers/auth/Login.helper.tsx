import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const emailInput = () => {
  return screen.getByRole('textbox', {
    name: 'auth.login.form.email.label',
  });
};

export const passwordInput = () => {
  return document.querySelector("[name='password']")!;
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.login.form.submit',
  });
};

export const exampleData = {
  email: 'john@doe.com',
  password: 'Password1',
};

export const fillUpForm = async (data: { email: string; password: string }) => {
  await userEvent.type(emailInput(), data.email);
  await userEvent.type(passwordInput(), data.password);
};
