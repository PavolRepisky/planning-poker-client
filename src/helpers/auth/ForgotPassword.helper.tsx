import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getEmailInput = () =>
  screen.getByRole('textbox', {
    name: 'auth.forgotPassword.form.email.label',
  });

export const getSubmitButton = () =>
  screen.getByRole('button', {
    name: 'auth.forgotPassword.form.submit',
  });

export const exampleData = {
  email: 'john@doe.com',
};

export const fillUpForm = async (data: { email: string }) => {
  const emailInput = getEmailInput();

  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, data.email);
};
