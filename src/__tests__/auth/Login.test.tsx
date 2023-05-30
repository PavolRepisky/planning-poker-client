import userEvent from '@testing-library/user-event';
import Login from 'auth/pages/Login';
import {
  exampleData,
  fillUpForm,
  getEmailInput,
  getPasswordInput,
  getSubmitButton,
} from 'helpers/auth/Login.helper';
import {
  getLogo,
  getSettingsButton,
  getToolbar,
} from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

const mockedLogin = jest.fn();
jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    isLoggingIn: false,
    login: mockedLogin,
  }),
}));

jest.mock('core/components/SettingsDrawer', () => {
  return (props: any) =>
    props.open ? <div data-testid="settings-drawer" /> : <></>;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
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

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Login page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<Login />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logo, which navigates to the landing page', async () => {
      render(<Login />);

      const logo = getLogo();
      expect(logo).toBeInTheDocument();

      await userEvent.click(logo);
      expect(mockedNavigate).toBeCalledWith('/', expect.anything());
    });

    it('contains a settings button, which the opens settings drawer', async () => {
      render(<Login />);

      const settingsButton = getSettingsButton();
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();

      await userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      });
    });
  });

  it('contains a login title', () => {
    render(<Login />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.login.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a login form with submit button', () => {
    render(<Login />);

    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains a register link, which navigates to the register page', async () => {
    render(<Login />);

    const registerLink = screen.getByRole('link', {
      name: 'common.register',
    });
    expect(registerLink).toBeInTheDocument();

    await userEvent.click(registerLink);
    expect(mockedNavigate).toBeCalledWith('/register', expect.anything());
  });

  it('contains a reset password link, which navigates to the reset password page', async () => {
    render(<Login />);

    const resetLink = screen.getByRole('link', {
      name: 'auth.login.resetPassword',
    });
    expect(resetLink).toBeInTheDocument();

    await userEvent.click(resetLink);
    expect(mockedNavigate).toBeCalledWith(
      '/forgot-password',
      expect.anything()
    );
  });

  it('contains a back-home link, which navigates to the landing page', async () => {
    render(<Login />);

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();

    await userEvent.click(backHomeLink);
    expect(mockedNavigate).toBeCalledWith('/', expect.anything());
  });

  it('handles inputs changes', async () => {
    render(<Login />);

    await fillUpForm(exampleData);

    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
  });

  it('validates, that all fields are filled and text fields are trimmed', async () => {
    render(<Login />);

    await fillUpForm({
      email: '   ',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('validates e-mail format', async () => {
    render(<Login />);

    await fillUpForm({
      email: 'invalid-email',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.email.invalid').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<Login />);

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(
        exampleData.email,
        exampleData.password
      );
    });
  });

  it('redirects to the users homepage in case of a successful login request', async () => {
    render(<Login />);

    mockedLogin.mockResolvedValueOnce('mocked-access-token');

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    expect(mockedNavigate).toHaveBeenCalledWith('/home');
  });

  it('calls an error alert and form values remain intact, in case the login request fails with a status code other than 400, 401 and 403', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
  });

  it('displays server validations errors and form values remain intact, in case the login request fails with status code 400', async () => {
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
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(emailError)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordError)).toBeInTheDocument();

    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
  });

  it('displays invalid credentials error and form values remain intact, in case the login request fails with status code 401', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText('auth.login.invalidCredentials')
      ).toBeInTheDocument();
    });

    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
  });

  it('displays not verified email error and form values remain intact, in case the login request fails with status code 403', async () => {
    render(<Login />);

    mockedLogin.mockRejectedValueOnce({
      response: {
        status: 403,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.getByText('auth.login.unverifiedEmail')
      ).toBeInTheDocument();
    });

    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
  });
});
