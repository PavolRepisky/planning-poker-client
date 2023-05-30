import userEvent from '@testing-library/user-event';
import ResetPassword from 'auth/pages/ResetPassword';
import {
  exampleData,
  fillUpForm,
  getConfirmPasswordInput,
  getPasswordInput,
  getSubmitButton,
} from 'helpers/auth/ResetPassword.helper';
import {
  getLogo,
  getSettingsButton,
  getToolbar,
} from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

const mockedResetPassword = jest.fn();
jest.mock('auth/hooks/useResetPassword', () => ({
  useResetPassword: () => ({
    isResetting: false,
    resetPassword: mockedResetPassword,
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

describe('Reset password page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<ResetPassword />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logo, which navigates to the landing page', async () => {
      render(<ResetPassword />);

      const logo = getLogo();
      expect(logo).toBeInTheDocument();

      await userEvent.click(logo);
      expect(mockedNavigate).toBeCalledWith('/', expect.anything());
    });

    it('contains a settings button, which the opens settings drawer', async () => {
      render(<ResetPassword />);

      const settingsButton = getSettingsButton();
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();

      await userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      });
    });
  });

  it('contains a reset password title', () => {
    render(<ResetPassword />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.resetPassword.title',
      })
    ).toBeInTheDocument();
  });

  it('conatins a reset password form with submit button', () => {
    render(<ResetPassword />);

    expect(getPasswordInput()).toBeInTheDocument();
    expect(getConfirmPasswordInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains a back-home link, which navigates to the landing page', async () => {
    render(<ResetPassword />);

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();

    await userEvent.click(backHomeLink);
    expect(mockedNavigate).toBeCalledWith('/', expect.anything());
  });

  it('validates, that all fields are filled', async () => {
    render(<ResetPassword />);

    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('handles inputs changes', async () => {
    render(<ResetPassword />);

    await fillUpForm(exampleData);

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('validates password strength', async () => {
    render(<ResetPassword />);

    await fillUpForm({ password: 'weak-password' });

    await userEvent.type(getPasswordInput(), 'weak-password');
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates passwords match', async () => {
    render(<ResetPassword />);

    await fillUpForm({
      password: exampleData.password,
      confirmationPassword: exampleData.confirmationPassword + 'mismatch',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.match').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<ResetPassword />);

    await waitFor(() => {
      expect(mockedResetPassword).toBeCalledWith({
        password: '',
        confirmationPassword: '',
        resetToken: '',
      });
    });

    mockedResetPassword.mockClear();

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedResetPassword).toBeCalledWith({
        ...exampleData,
        resetToken: '',
      });
    });
  });

  it('calls a success alert and redirects to the login page in case of a successful reset password request', async () => {
    render(<ResetPassword />);

    mockedResetPassword.mockResolvedValueOnce({});

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'auth.resetPassword.notifications.success'
      );
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and form values remain intact, in case the reset password request fails with a status code other than 400', async () => {
    render(<ResetPassword />);

    mockedResetPassword.mockRejectedValueOnce({
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

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors and form values remain intact, in case the reset password request fails with status code 400', async () => {
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
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(passwordError1)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordError2)).toBeInTheDocument();

    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('redirects to 404 page, in case of invalid reset token', async () => {
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
