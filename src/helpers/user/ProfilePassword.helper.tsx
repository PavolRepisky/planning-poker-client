import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getPasswordInput = () =>
  document.querySelector("[name='password']")!;

export const getNewPasswordInput = () =>
  document.querySelector("[name='newPassword']")!;

export const getConfirmPasswordInput = () =>
  document.querySelector("[name='confirmationPassword']")!;

export const submitButton = () =>
  screen.getByRole('button', {
    name: 'common.update',
  });

export const exampleData = {
  password: 'Password1',
  newPassword: 'Password2',
  confirmationPassword: 'Password2',
};

export const fillUpForm = async (data: {
  password?: string;
  newPassword?: string;
  confirmationPassword?: string;
}) => {
  const passwordInput = getPasswordInput();
  const newPasswordInput = getNewPasswordInput();
  const confirmationPasswordInput = getConfirmPasswordInput();

  await userEvent.clear(passwordInput);
  await userEvent.clear(newPasswordInput);
  await userEvent.clear(confirmationPasswordInput);

  if (data.password) await userEvent.type(passwordInput, data.password);
  if (data.newPassword)
    await userEvent.type(newPasswordInput, data.newPassword);
  if (data.confirmationPassword)
    await userEvent.type(confirmationPasswordInput, data.confirmationPassword);
};
