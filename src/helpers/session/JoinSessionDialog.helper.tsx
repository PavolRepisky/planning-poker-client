import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const hashIdInput = () =>
  screen.getByRole('textbox', {
    name: 'session.dialog.join.form.hashId.label',
  });

export const joinButton = () =>
  screen.getByRole('button', {
    name: 'session.dialog.join.form.submit',
  });

export const cancelButton = () =>
  screen.getByRole('button', {
    name: 'common.cancel',
  });

export const exampleData = {
  hashId: 'example-session-id',
};

export const fillUpForm = async (data: { hashId: string }) => {
  const hashIdElm = hashIdInput();
  await userEvent.clear(hashIdElm);
  await userEvent.type(hashIdElm, data.hashId);
};
