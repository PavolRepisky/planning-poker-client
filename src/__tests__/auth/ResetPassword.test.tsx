import userEvent from '@testing-library/user-event';
import ResetPassword from 'auth/pages/ResetPassword';
import {
  confirmationPasswordInput,
  exampleData,
  fillUpForm,
  passwordInput,
  submitButton,
} from 'helpers/auth/ResetPassword.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

// Mock the useResetPassword hook
const mockedResetPassword = jest.fn();
jest.mock('auth/hooks/useResetPassword', () => ({
  useResetPassword: () => ({
    isResetting: false,
    resetPassword: mockedResetPassword,
  }),
}));

// Mock the useSnackbar hook
const mockedSnackbarSuccess = jest.fn();
const mockedSnackbarError = jest.fn();
jest.mock('core/contexts/SnackbarProvider', () => ({
  useSnackbar: () => ({
    success: mockedSnackbarSuccess,
    error: mockedSnackbarError,
  }),
}));

// Mock the useNavigate hook
const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Reset password page', () => {
  it('renders title correctly', () => {
    render(<ResetPassword />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.resetPassword.title',
      })
    ).toBeInTheDocument();
  });

  it('renders form correctly', () => {
    render(<ResetPassword />);

    expect(passwordInput()).toBeInTheDocument();
    expect(confirmationPasswordInput()).toBeInTheDocument();
  });

  it('renders back-home link correctly', async () => {
    render(<ResetPassword />);

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();
    expect(backHomeLink).toHaveAttribute('href', '/');
  });

  it('handles inputs changes', async () => {
    render(<ResetPassword />);

    await userEvent.type(passwordInput(), exampleData.password);
    expect(passwordInput()).toHaveValue(exampleData.password);

    await userEvent.type(
      confirmationPasswordInput(),
      exampleData.confirmationPassword
    );
    expect(confirmationPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('validates password strength', async () => {
    render(<ResetPassword />);

    await userEvent.type(passwordInput(), 'weak-password');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates passwords match', async () => {
    render(<ResetPassword />);

    await userEvent.type(passwordInput(), exampleData.password);
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
    render(<ResetPassword />);

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedResetPassword.mock.calls).toEqual([
      [
        {
          password: '',
          confirmationPassword: '',
          resetToken: '',
        },
      ],
      [
        {
          ...exampleData,
          resetToken: '',
        },
      ],
    ]);
  });

  it('calls a success alert and redirects to the logged user homepage in case of a successful reset password request', async () => {
    render(<ResetPassword />);

    mockedResetPassword.mockResolvedValueOnce({
      status: 200,
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and form values remain intact in case the reset password request fails with a status code other than 400', async () => {
    render(<ResetPassword />);

    mockedResetPassword.mockRejectedValueOnce({
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
    expect(confirmationPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors in case the reset password request fails with status code 400', async () => {
    render(<ResetPassword />);

    const passwordError1 = 'Password is too weak';
    const passwordError2 = 'Passwords to not match';

    mockedResetPassword.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'password',
              value: 'weak-password',
              message: passwordError1,
              location: 'body',
            },
            {
              path: 'confirmationPassword',
              value: 'mismatch',
              message: passwordError2,
              location: 'body',
            },
          ],
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText(passwordError1)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordError2)).toBeInTheDocument();
  });

  it('redirects to 404 page in case of invalid reset token', async () => {
    mockedResetPassword.mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(mockedNavigate).toBeCalledWith('/404');
    });
  });
});
