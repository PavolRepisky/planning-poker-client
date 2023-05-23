import userEvent from '@testing-library/user-event';
import {
  confirmationPasswordInput,
  exampleData,
  fillUpForm,
  newPasswordInput,
  passwordInput,
  submitButton,
} from 'helpers/user/ProfilePassword.helper';
import { render, screen, waitFor } from 'test-utils';
import ProfilePassword from 'user/pages/ProfilePassword';

const mockedUserData = {
  id: 1,
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};
jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: mockedUserData,
  }),
}));

const mockedUpdatePassword = jest.fn();
jest.mock('user/hooks/useUpdatePassword', () => ({
  useUpdatePassword: () => ({
    isUpdating: false,
    updatePassword: mockedUpdatePassword,
  }),
}));

const mockedSnackbarSuccess = jest.fn();
const mockedSnackbarError = jest.fn();
jest.mock('core/contexts/SnackbarProvider', () => ({
  useSnackbar: () => ({
    success: mockedSnackbarSuccess,
    error: mockedSnackbarError,
  }),
}));

describe('Profile password page', () => {
  it('renders form title correctly', async () => {
    render(<ProfilePassword />);

    expect(screen.getByText('profile.password.title')).toBeInTheDocument();
  });

  it('renders form correctly', () => {
    render(<ProfilePassword />);

    expect(passwordInput()).toBeInTheDocument();
    expect(passwordInput()).toHaveAttribute('type', 'password');

    expect(newPasswordInput()).toBeInTheDocument();
    expect(newPasswordInput()).toHaveAttribute('type', 'password');

    expect(confirmationPasswordInput()).toBeInTheDocument();
    expect(confirmationPasswordInput()).toHaveAttribute('type', 'password');

    expect(submitButton()).toBeInTheDocument();
  });

  it('handles inputs changes', async () => {
    render(<ProfilePassword />);

    await userEvent.type(passwordInput(), exampleData.password);
    expect(passwordInput()).toHaveValue(exampleData.password);

    await userEvent.type(newPasswordInput(), exampleData.newPassword);
    expect(newPasswordInput()).toHaveValue(exampleData.newPassword);

    await userEvent.type(
      confirmationPasswordInput(),
      exampleData.confirmationPassword
    );
    expect(confirmationPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('validates, that all inputs are filled', async () => {
    render(<ProfilePassword />);

    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        3
      );
    });
  });

  it('validates new password strength', async () => {
    render(<ProfilePassword />);

    await userEvent.type(newPasswordInput(), 'weak-password');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates passwords match', async () => {
    render(<ProfilePassword />);

    await userEvent.type(newPasswordInput(), exampleData.newPassword);
    await userEvent.type(
      confirmationPasswordInput(),
      exampleData.password + 'mismatch'
    );
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.match').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<ProfilePassword />);

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedUpdatePassword).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert in case of a successful update password request', async () => {
    render(<ProfilePassword />);

    mockedUpdatePassword.mockResolvedValueOnce({
      status: 200,
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarSuccess).toBeCalledWith(
      'profile.password.notifications.success'
    );
  });

  it('calls an error alert and form values remain intact in case the update password request fails with a status code other than 400 and 401', async () => {
    render(<ProfilePassword />);

    mockedUpdatePassword.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );

    expect(passwordInput()).toHaveValue(exampleData.password);
    expect(newPasswordInput()).toHaveValue(exampleData.newPassword);
    expect(confirmationPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors in case the update password request fails with status code 400', async () => {
    render(<ProfilePassword />);

    const newPasswordError = 'Password is too weak';
    const confirmationPasswordError = 'Password must match';

    mockedUpdatePassword.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'newPassword',
              value: 'weak-password',
              message: newPasswordError,
              location: 'body',
            },
            {
              path: 'confirmationPassword',
              value: 'mismatch',
              message: confirmationPasswordError,
              location: 'body',
            },
          ],
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText(newPasswordError)).toBeInTheDocument();
    });
    expect(screen.getByText(confirmationPasswordError)).toBeInTheDocument();
  });

  it('displays invalid credentials error in case the login request fails with status code 401', async () => {
    render(<ProfilePassword />);

    mockedUpdatePassword.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.getByText('auth.login.invalidCredentials')
      ).toBeInTheDocument();
    });
  });
});
