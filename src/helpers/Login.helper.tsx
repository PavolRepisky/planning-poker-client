import user from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getEmailField = () => {
  return screen.getByRole('textbox', {
    name: 'auth.login.form.email.label',
  });
};

export const getPasswordField = () => {
  return document.querySelector("[name='password']");
};

export const getSubmitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.login.form.submit',
  });
};

export const fillFormWithCorrectValues = async () => {
  await user.type(getEmailField(), 'joe@doe.com');

  const passwordField = getPasswordField();
  if (passwordField) {
    await user.type(passwordField, 'Password1');
  }
};
