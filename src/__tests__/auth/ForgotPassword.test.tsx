import userEvent from '@testing-library/user-event';
import ForgotPassword from 'auth/pages/ForgotPassword';
import {
  exampleData,
  fillUpForm,
  getEmailInput,
  getSubmitButton,
} from 'helpers/auth/ForgotPassword.helper';
import {
  getLogo,
  getSettingsButton,
  getToolbar,
} from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

const mockedForgotPassword = jest.fn();
jest.mock('auth/hooks/useForgotPassword', () => ({
  useForgotPassword: () => ({
    isSending: false,
    forgotPassword: mockedForgotPassword,
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

describe('Forgot password page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<ForgotPassword />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logo, which navigates to the landing page', async () => {
      render(<ForgotPassword />);

      const logo = getLogo();
      expect(logo).toBeInTheDocument();

      await userEvent.click(logo);
      expect(mockedNavigate).toBeCalledWith('/', expect.anything());
    });

    it('contains a settings button, which the opens settings drawer', async () => {
      render(<ForgotPassword />);

      const settingsButton = getSettingsButton();
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();

      await userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      });
    });
  });

  it('contains a forgot password title and a message', () => {
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

  it('contains a email form with submit button', () => {
    render(<ForgotPassword />);

    expect(getEmailInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains back-to-login link, which navigates to the login page', async () => {
    render(<ForgotPassword />);

    const backToLoginLink = screen.getByRole('link', {
      name: 'auth.forgotPassword.backToLogin',
    });
    expect(backToLoginLink).toBeInTheDocument();

    await userEvent.click(backToLoginLink);
    expect(mockedNavigate).toBeCalledWith('/login', expect.anything());
  });

  it('handles inputs changes', async () => {
    render(<ForgotPassword />);

    await fillUpForm(exampleData);
    expect(getEmailInput()).toHaveValue(exampleData.email);
  });

  it('validates email is filled and trims it', async () => {
    render(<ForgotPassword />);

    await fillUpForm({ email: '    ' });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        1
      );
    });
  });

  it('validates e-mail format', async () => {
    render(<ForgotPassword />);

    await fillUpForm({ email: 'invalid-email' });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.email.invalid').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<ForgotPassword />);

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

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
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'auth.forgotPassword.notifications.success'
      );
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and form values remain intact, in case the forgot password request fails with a status code other than 400', async () => {
    render(<ForgotPassword />);

    mockedForgotPassword.mockRejectedValueOnce({
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
  });

  it('displays server validations errors and form values remain intact, in case the forgot password request fails with status code 400', async () => {
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
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(emailError)).toBeInTheDocument();
    });

    expect(getEmailInput()).toHaveValue(exampleData.email);
  });
});
