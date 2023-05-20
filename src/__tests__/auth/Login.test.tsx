import userEvent from '@testing-library/user-event';
import Login from 'auth/pages/Login';
import {
  emailInput,
  exampleData,
  fillUpForm,
  passwordInput,
  submitButton,
} from 'helpers/auth/Login.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

// Mock the useAuth hook
const mockedLogin = jest.fn();
jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    isLoggingIn: false,
    login: mockedLogin,
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

describe('Login page', () => {
  it('renders title correctly', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.login.title',
      })
    ).toBeInTheDocument();
  });

  it('renders form correctly', () => {
    render(<Login />);

    expect(emailInput()).toBeInTheDocument();
    expect(passwordInput()).toBeInTheDocument();
  });

  it('renders register, reset password and back-home links correctly', async () => {
    render(<Login />);

    const registerLink = screen.getByRole('link', {
      name: 'common.register',
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');

    const resetLink = screen.getByRole('link', {
      name: 'auth.login.resetPassword',
    });
    expect(resetLink).toBeInTheDocument();
    expect(resetLink).toHaveAttribute('href', '/forgot-password');

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();
    expect(backHomeLink).toHaveAttribute('href', '/');
  });

  it('handles inputs changes', async () => {
    render(<Login />);

    await userEvent.type(emailInput(), exampleData.email);
    expect(emailInput()).toHaveValue(exampleData.email);

    await userEvent.type(passwordInput(), exampleData.password);
    expect(passwordInput()).toHaveValue(exampleData.password);
  });

  it('validates and trims the required inputs', async () => {
    render(<Login />);

    await userEvent.type(emailInput(), '    ');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('validates e-mail format', async () => {
    render(<Login />);

    await userEvent.type(emailInput(), 'invalid-email');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.email.invalid').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<Login />);

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(
        exampleData.email,
        exampleData.password
      );
    });
  });

  it('calls a success alert and redirects to the logged user homepage in case of a successful login request', async () => {
    render(<Login />);

    mockedLogin.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          accessToken: 'access-token',
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/home');
  });

  it('calls an error alert and form values remain intact in case the login request fails with a status code other than 400, 401 and 403', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );

    expect(emailInput()).toHaveValue(exampleData.email);
    expect(passwordInput()).toHaveValue(exampleData.password);
  });

  it('displays server validations errors in case the login request fails with status code 400', async () => {
    render(<Login />);

    const emailError = 'E-mail address is invalid';
    const passwordError = 'Password is too weak';

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'email',
              value: 'taken@email.com',
              message: emailError,
              location: 'body',
            },
            {
              path: 'password',
              value: 'Password1',
              message: passwordError,
              location: 'body',
            },
          ],
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText(emailError)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordError)).toBeInTheDocument();
  });

  it('displays invalid credentials error in case the login request fails with status code 401', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
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

  it('displays not verified email error in case the login request fails with status code 403', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 403,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.getByText('auth.login.unverifiedEmail')
      ).toBeInTheDocument();
    });
  });
});
