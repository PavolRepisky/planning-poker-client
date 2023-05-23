import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const passwordInput = () => {
  return document.querySelector("[name='password']")!;
};

export const newPasswordInput = () => {
  return document.querySelector("[name='newPassword']")!;
};

export const confirmationPasswordInput = () => {
  return document.querySelector("[name='confirmationPassword']")!;
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'common.update',
  });
};

export const exampleData = {
  password: 'Password1',
  newPassword: 'Password2',
  confirmationPassword: 'Password2',
};

export const fillUpForm = async (data: {
  password: string;
  newPassword: string;
  confirmationPassword: string;
}) => {
  await userEvent.type(passwordInput(), data.password);
  await userEvent.type(newPasswordInput(), data.newPassword);
  await userEvent.type(confirmationPasswordInput(), data.confirmationPassword);
};
