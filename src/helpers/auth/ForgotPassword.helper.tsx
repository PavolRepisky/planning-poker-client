import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const emailInput = () => {
  return screen.getByRole('textbox', {
    name: 'auth.forgotPassword.form.email.label',
  });
};

export const submitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.forgotPassword.form.submit',
  });
};

export const exampleData = {
  email: 'john@doe.com',
};

export const fillUpForm = async (data: { email: string }) => {
  await userEvent.type(emailInput(), data.email);
};
