/* eslint-disable testing-library/no-node-access */
import user from '@testing-library/user-event';
import Login from 'auth/pages/Login';
import axios from 'axios';
import ServerValidationError from 'core/types/ServerValidationError';
import {
  fillFormWithCorrectValues,
  getEmailField,
  getPasswordField,
  getSubmitButton,
} from 'helpers/Login.helper';
import * as router from 'react-router';
import { cleanup, render, screen, waitFor } from 'test-utils';

/* --------- Mocks -------- */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});
/*------------------------- */

afterEach(() => {
  cleanup();
});

describe('Login page', () => {
  it('contains a title', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.login.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a login form', () => {
    render(<Login />);

    expect(getEmailField()).toBeInTheDocument();
    expect(getPasswordField()).toBeInTheDocument();
  });

  it('contains a register, reset and back home links', async () => {
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

  it('all fields are required and text fields are trimmed', async () => {
    render(<Login />);
    user.setup();

    await user.click(getSubmitButton());

    await waitFor(() => {
      const requiredErrors = screen.queryAllByText(
        'common.validations.required'
      );
      expect(requiredErrors.length).toBe(2);
    });

    await user.type(getEmailField(), '  ');
    const passwordField = getPasswordField();
    if (passwordField) {
      await user.type(passwordField, '   ');
    }

    await waitFor(() => {
      const requiredErrors = screen.queryAllByText(
        'common.validations.required'
      );
      expect(requiredErrors.length).toBe(1);
    });
  });

  it('validates e-mail format', async () => {
    render(<Login />);
    user.setup();

    await user.type(getEmailField(), 'invalid-email');
    await user.click(getSubmitButton());

    await waitFor(() => {
      const emailError = screen.getByText('common.validations.email.invalid');
      expect(emailError).toBeInTheDocument();
    });
  });

  it('shows an error alert, if request fails with status code other than 400 and 401', async () => {
    render(<Login />);
    user.setup();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 500,
      },
    });

    expect(getEmailField()).toBeInTheDocument();
    expect(getPasswordField()).toBeInTheDocument();
  });

  it('sets returned validations errors, if the request fails with status code 400', async () => {
    render(<Login />);
    user.setup();

    const emailServerError = 'E-mail address is already taken';
    const passwordServerError = 'Password is too weak';

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'email',
              value: 'taken@email.com',
              message: emailServerError,
              location: 'body',
            } as ServerValidationError,
            {
              path: 'password',
              value: 'Password1',
              message: passwordServerError,
              location: 'body',
            } as ServerValidationError,
          ],
        },
      },
    });

    await fillFormWithCorrectValues();
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(emailServerError)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordServerError)).toBeInTheDocument();
  });

  it('redirects to homepage, if correct values are submitted', async () => {
    render(<Login />);
    user.setup();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        data: {
          accessToken: 'xmw8q9x8wxpxqic9',
        },
      },
    });

    await fillFormWithCorrectValues();
    await user.click(getSubmitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});
