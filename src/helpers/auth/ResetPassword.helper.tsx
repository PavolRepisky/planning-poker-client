import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getPasswordInput = () =>
  document.querySelector("[name='password']")!;

export const getConfirmPasswordInput = () =>
  document.querySelector("[name='confirmationPassword']")!;

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'auth.resetPassword.form.submit',
  });

export const exampleData = {
  password: 'Password1',
  confirmationPassword: 'Password1',
};

export const fillUpForm = async (data: {
  password?: string;
  confirmationPassword?: string;
}) => {
  const passwordInput = getPasswordInput();
  const confirmPasswordInput = getConfirmPasswordInput();

  await userEvent.clear(passwordInput);
  await userEvent.clear(confirmPasswordInput);

  if (data.password) await userEvent.type(passwordInput, data.password);
  if (data.confirmationPassword)
    await userEvent.type(confirmPasswordInput, data.confirmationPassword);
};
