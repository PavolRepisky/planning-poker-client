import userEvent from '@testing-library/user-event';
import Register from 'auth/pages/Register';
import config from 'core/config/config';
import {
  confirmationPasswordInput,
  emailInput,
  exampleData,
  fillUpForm,
  firstNameInput,
  lastNameInput,
  passwordInput,
  submitButton,
} from 'helpers/auth/Register.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

// Mock the useRegister hook
const mockedRegister = jest.fn();
jest.mock('auth/hooks/useRegister', () => ({
  useRegister: () => ({
    isRegistering: false,
    register: mockedRegister,
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

describe('Registration page', () => {
  it('renders title correctly', () => {
    render(<Register />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.register.title',
      })
    ).toBeInTheDocument();
  });

  it('renders form correctly', () => {
    render(<Register />);

    expect(firstNameInput()).toBeInTheDocument();
    expect(lastNameInput()).toBeInTheDocument();
    expect(emailInput()).toBeInTheDocument();
    expect(passwordInput()).toBeInTheDocument();
    expect(confirmationPasswordInput()).toBeInTheDocument();
    expect(submitButton()).toBeInTheDocument();
  });

  it('renders login and back-home links correctly', async () => {
    render(<Register />);

    const loginLink = screen.getByRole('link', {
      name: 'common.login',
    });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();
    expect(backHomeLink).toHaveAttribute('href', '/');
  });

  it('handles inputs changes', async () => {
    render(<Register />);

    await userEvent.type(firstNameInput(), exampleData.firstName);
    expect(firstNameInput()).toHaveValue(exampleData.firstName);

    await userEvent.type(lastNameInput(), exampleData.lastName);
    expect(lastNameInput()).toHaveValue(exampleData.lastName);

    await userEvent.type(emailInput(), exampleData.email);
    expect(emailInput()).toHaveValue(exampleData.email);

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

  it('validates and trims the required inputs', async () => {
    render(<Register />);

    await userEvent.type(firstNameInput(), ' ');
    await userEvent.type(lastNameInput(), '  ');
    await userEvent.type(emailInput(), '    ');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        5
      );
    });
  });

  it('validates name inputs max length', async () => {
    render(<Register />);

    await userEvent.type(
      firstNameInput(),
      'f'.repeat(config.maxNameLength + 1)
    );

    await userEvent.type(lastNameInput(), 'l'.repeat(config.maxNameLength + 1));
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 10000);

  it('validates e-mail format', async () => {
    render(<Register />);

    await userEvent.type(emailInput(), 'invalid-email');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.email.invalid').length
      ).toBe(1);
    });
  });

  it('validates password strength', async () => {
    render(<Register />);

    await userEvent.type(passwordInput(), 'weak-password');
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates passwords match', async () => {
    render(<Register />);

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
    render(<Register />);

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert and redirects to the login page in case of a successful registration request', async () => {
    render(<Register />);

    mockedRegister.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          userId: 'user-id',
        },
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
    expect(mockedSnackbarSuccess).toBeCalledWith(
      'auth.register.notifications.success'
    );
  });

  it('calls an error alert and form values remain intact in case the registration request fails with a status code other than 400', async () => {
    render(<Register />);

    mockedRegister.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );

    expect(firstNameInput()).toHaveValue(exampleData.firstName);
    expect(lastNameInput()).toHaveValue(exampleData.lastName);
    expect(emailInput()).toHaveValue(exampleData.email);
    expect(passwordInput()).toHaveValue(exampleData.password);
    expect(confirmationPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors in case the registration request fails with status code 400', async () => {
    render(<Register />);

    const emailError = 'E-mail address is already taken';
    const passwordError = 'Password is too weak';

    mockedRegister.mockRejectedValueOnce({
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
});
