import userEvent from '@testing-library/user-event';
import {
  exampleData,
  fillUpForm,
  getConfirmPasswordInput,
  getNewPasswordInput,
  getPasswordInput,
  submitButton,
} from 'helpers/user/ProfilePassword.helper';
import { render, screen, waitFor } from 'test-utils';
import ProfilePassword from 'user/pages/ProfilePassword';

const userData = {
  id: 'mocked-user-id',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: userData,
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

describe('Profile password page', () => {
  it('contains a password change title', async () => {
    render(<ProfilePassword />);

    expect(screen.getByText('profile.password.title')).toBeInTheDocument();
  });

  it('conatins a password change form', () => {
    render(<ProfilePassword />);

    expect(getPasswordInput()).toBeInTheDocument();
    expect(getNewPasswordInput()).toBeInTheDocument();
    expect(getConfirmPasswordInput()).toBeInTheDocument();
    expect(submitButton()).toBeInTheDocument();
  });

  it('handles inputs changes', async () => {
    render(<ProfilePassword />);

    await fillUpForm(exampleData);

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getNewPasswordInput()).toHaveValue(exampleData.newPassword);
    expect(getConfirmPasswordInput()).toHaveValue(
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

    await fillUpForm({
      newPassword: 'weak-password',
    });
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates new passwords match', async () => {
    render(<ProfilePassword />);

    await fillUpForm({
      newPassword: exampleData.newPassword,
      confirmationPassword: exampleData.confirmationPassword + 'mismatch',
    });
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

    mockedUpdatePassword.mockResolvedValueOnce({});

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'profile.password.notifications.success'
      );
    });
  });

  it('calls an error alert and form values remain intact, in case the update password request fails with a status code other than 400 and 401', async () => {
    render(<ProfilePassword />);

    mockedUpdatePassword.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getNewPasswordInput()).toHaveValue(exampleData.newPassword);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors and form values remain intact, in case the update password request fails with status code 400', async () => {
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

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getNewPasswordInput()).toHaveValue(exampleData.newPassword);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays invalid credentials error and form values remain intact, in case the login request fails with status code 401', async () => {
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

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getNewPasswordInput()).toHaveValue(exampleData.newPassword);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });
});
