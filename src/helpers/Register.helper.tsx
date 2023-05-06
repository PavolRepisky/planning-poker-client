import user from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getFirstNameField = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.firstName.label',
  });
};

export const getLastNameField = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.lastName.label',
  });
};

export const getEmailField = () => {
  return screen.getByRole('textbox', {
    name: 'auth.register.form.email.label',
  });
};

export const getPasswordField = () => {
  return document.querySelector("[name='password']");
};

export const getConfirmationPasswordField = () => {
  return document.querySelector("[name='confirmationPassword']");
};

export const getSubmitButton = () => {
  return screen.getByRole('button', {
    name: 'auth.register.form.submit',
  });
};

export const fillFormWithCorrectValues = async () => {
  await user.type(getFirstNameField(), 'Joe');
  await user.type(getLastNameField(), 'Doe');
  await user.type(getEmailField(), 'joe@doe.com');

  const passwordField = getPasswordField();
  if (passwordField) {
    await user.type(passwordField, 'Password1');
  }

  const confirmationPasswordField = getConfirmationPasswordField();
  if (confirmationPasswordField) {
    await user.type(confirmationPasswordField, 'Password1');
  }
};
