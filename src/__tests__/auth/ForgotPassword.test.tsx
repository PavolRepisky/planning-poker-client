import userEvent from '@testing-library/user-event';
import ForgotPassword from 'auth/pages/ForgotPassword';
import {
  emailInput,
  exampleData,
  fillUpForm,
  submitButton,
} from 'helpers/auth/ForgotPassword.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

// Mock the useForgotPassword hook
const mockedForgotPassword = jest.fn();
jest.mock('auth/hooks/useForgotPassword', () => ({
  useForgotPassword: () => ({
    isSending: false,
    forgotPassword: mockedForgotPassword,
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

describe('Forgot password page', () => {
  it('renders title and subtitle correctly', () => {
    render(<ForgotPassword />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.forgotPassword.title',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('auth.forgotPassword.subTitle')
    ).toBeInTheDocument();
  });

  it('renders form correctly', () => {
    render(<ForgotPassword />);

    expect(emailInput()).toBeInTheDocument();
  });

  it('renders back to login link correctly', async () => {
    render(<ForgotPassword />);

    const backToLoginLink = screen.getByRole('link', {
      name: 'auth.forgotPassword.backToLogin',
    });
    expect(backToLoginLink).toBeInTheDocument();
    expect(backToLoginLink).toHaveAttribute('href', '/login');
  });

  it('handles inputs changes', async () => {
    render(<ForgotPassword />);

    await userEvent.type(emailInput(), exampleData.email);
    expect(emailInput()).toHaveValue(exampleData.email);
  });

  it('validates and trims the required inputs', async () => {
    render(<ForgotPassword />);

    await userEvent.type(emailInput(), '    ');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        1
      );
    });
  });

  it('validates e-mail format', async () => {
    render(<ForgotPassword />);

    await userEvent.type(emailInput(), 'invalid-email');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.email.invalid').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<ForgotPassword />);

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedForgotPassword).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert and redirects to login page in case of a successful forgot password request', async () => {
    render(<ForgotPassword />);

    mockedForgotPassword.mockResolvedValueOnce({
      status: 200,
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and form values remain intact in case the forgot password request fails with a status code other than 400', async () => {
    render(<ForgotPassword />);

    mockedForgotPassword.mockRejectedValueOnce({
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
  });

  it('displays server validations errors in case the forgot password request fails with status code 400', async () => {
    render(<ForgotPassword />);

    const emailError = 'E-mail address is invalid';

    mockedForgotPassword.mockRejectedValueOnce({
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
          ],
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText(emailError)).toBeInTheDocument();
    });
  });
});
