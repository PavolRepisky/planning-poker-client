import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const passwordInput = () => {
  return document.querySelector("[name='password']")!;
};

export const confirmationPasswordInput = () => {
  return document.querySelector("[name='confirmationPassword']")!;
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.resetPassword.form.submit',
  });
};

export const exampleData = {
  password: 'Password1',
  confirmationPassword: 'Password1',
};

export const fillUpForm = async (data: {
  password: string;
  confirmationPassword: string;
}) => {
  await userEvent.type(passwordInput(), data.password);
  await userEvent.type(confirmationPasswordInput(), data.confirmationPassword);
};
