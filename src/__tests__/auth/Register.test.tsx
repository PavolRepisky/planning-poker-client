/* eslint-disable testing-library/no-node-access */
import user from '@testing-library/user-event';
import Register from 'auth/pages/Register';
import axios from 'axios';
import config from 'core/config/config';
import ServerValidationError from 'core/types/ServerValidationError';
import {
  fillFormWithCorrectValues,
  getConfirmationPasswordField,
  getEmailField,
  getFirstNameField,
  getLastNameField,
  getPasswordField,
  getSubmitButton,
} from 'helpers/Register.helper';
import {
  expectToShowErrorAlert,
  expectToShowSuccessAlert,
} from 'helpers/Snackbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

/* --------- Mocks -------- */
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});
/*------------------------- */

describe('Register page', () => {
  it('contains a title', () => {
    render(<Register />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.register.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a registration form', () => {
    render(<Register />);

    expect(getFirstNameField()).toBeInTheDocument();
    expect(getLastNameField()).toBeInTheDocument();
    expect(getEmailField()).toBeInTheDocument();
    expect(getPasswordField()).toBeInTheDocument();
    expect(getConfirmationPasswordField()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains a login and back home links', async () => {
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

  it('all fields are required and text inputs are trimmed', async () => {
    render(<Register />);
    user.setup();

    await user.click(getSubmitButton());

    await waitFor(() => {
      const requiredErrors = screen.queryAllByText(
        'common.validations.required'
      );
      expect(requiredErrors.length).toBe(5);
    });

    await user.type(getFirstNameField(), '   ');
    await user.type(getLastNameField(), ' ');
    await user.type(getEmailField(), ' ');
    await user.click(getSubmitButton());

    await waitFor(() => {
      const requiredErrors = screen.queryAllByText(
        'common.validations.required'
      );
      expect(requiredErrors.length).toBe(5);
    });
  });

  it('name fields have limited max length', async () => {
    render(<Register />);
    user.setup();

    await user.type(getFirstNameField(), 'f'.repeat(config.maxNameLength + 1));
    await user.type(getLastNameField(), 'l'.repeat(config.maxNameLength + 1));

    await user.click(getSubmitButton());

    await waitFor(() => {
      const namesErrors = screen.queryAllByText(
        'common.validations.string.max'
      );
      expect(namesErrors.length).toBe(2);
    });
  });

  it('validates e-mail format', async () => {
    render(<Register />);
    user.setup();

    await user.type(getEmailField(), 'invalid-email');
    await user.click(getSubmitButton());

    await waitFor(() => {
      const emailError = screen.getByText('common.validations.email.invalid');
      expect(emailError).toBeInTheDocument();
    });
  });

  it('password can not be weak', async () => {
    render(<Register />);
    user.setup();

    const passwordField = getPasswordField();
    if (!passwordField) {
      return;
    }

    await user.type(passwordField, 'weakpassword');
    await user.click(getSubmitButton());

    await waitFor(() => {
      const passwordError = screen.getByText(
        'common.validations.password.weak'
      );
      expect(passwordError).toBeInTheDocument();
    });
  });

  it('confirmation password must match password', async () => {
    render(<Register />);
    user.setup();

    const passwordField = getPasswordField();
    const confirmationPasswordField = getConfirmationPasswordField();
    if (!passwordField || !confirmationPasswordField) {
      return false;
    }

    await user.type(passwordField, 'Password123');
    await user.type(confirmationPasswordField, 'invalid');
    await user.click(getSubmitButton());

    await waitFor(() => {
      const confirmationPasswordError = screen.getByText(
        'common.validations.password.match'
      );
      expect(confirmationPasswordError).toBeInTheDocument();
    });
  });

  it('shows a success alert and redirects to login page, if correct values are submitted', async () => {
    render(<Register />);
    user.setup();

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        data: {
          userId: 'mxsm9x0xs5x5w',
        },
      },
    });

    const passwordField = getPasswordField();
    const confirmationPasswordField = getConfirmationPasswordField();

    if (!passwordField || !confirmationPasswordField) {
      return;
    }

    await fillFormWithCorrectValues();
    await user.click(getSubmitButton());
    expect(mockedNavigate).toHaveBeenCalledWith('/login');

    await expectToShowSuccessAlert('auth.register.notifications.success');
  });

  it('shows an error alert, if request fails with status code other than 400', async () => {
    render(<Register />);
    user.setup();

    mockedAxios.post.mockRejectedValue({
      response: {
        status: 500,
      },
    });
    
    await fillFormWithCorrectValues();
    await user.click(getSubmitButton());

    await expectToShowErrorAlert();
  });

  it('shows returned validations errors, if the request fails with status code 400', async () => {
    render(<Register />);
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

    const passwordField = getPasswordField();
    const confirmationPasswordField = getConfirmationPasswordField();

    if (!passwordField || !confirmationPasswordField) {
      return;
    }

    await fillFormWithCorrectValues();
    await user.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(emailServerError)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordServerError)).toBeInTheDocument();
  });
});
