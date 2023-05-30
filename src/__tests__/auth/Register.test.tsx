import userEvent from '@testing-library/user-event';
import Register from 'auth/pages/Register';
import config from 'core/config/config';
import {
  exampleData,
  fillUpForm,
  getConfirmPasswordInput,
  getEmailInput,
  getFirstNameInput,
  getLastNameInput,
  getPasswordInput,
  getSubmitButton,
} from 'helpers/auth/Register.helper';
import {
  getLogo,
  getSettingsButton,
  getToolbar,
} from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor } from 'test-utils';

const mockedRegister = jest.fn();
jest.mock('auth/hooks/useRegister', () => ({
  useRegister: () => ({
    isRegistering: false,
    register: mockedRegister,
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

describe('Registration page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<Register />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logo, which navigates to the landing page', async () => {
      render(<Register />);

      const logo = getLogo();
      expect(logo).toBeInTheDocument();

      await userEvent.click(logo);
      expect(mockedNavigate).toBeCalledWith('/', expect.anything());
    });

    it('contains a settings button, which the opens settings drawer', async () => {
      render(<Register />);

      const settingsButton = getSettingsButton();
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();

      await userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      });
    });
  });

  it('contains a register title', () => {
    render(<Register />);

    expect(
      screen.getByRole('heading', {
        name: 'auth.register.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a register form with submit button', () => {
    render(<Register />);

    expect(getFirstNameInput()).toBeInTheDocument();
    expect(getLastNameInput()).toBeInTheDocument();
    expect(getEmailInput()).toBeInTheDocument();
    expect(getPasswordInput()).toBeInTheDocument();
    expect(getConfirmPasswordInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains a login link, which navigates to the login page', async () => {
    render(<Register />);

    const loginLink = screen.getByRole('link', {
      name: 'common.login',
    });
    expect(loginLink).toBeInTheDocument();

    await userEvent.click(loginLink);
    expect(mockedNavigate).toBeCalledWith('/login', expect.anything());
  });

  it('contains a back-home link, which navigates to the landing page', async () => {
    render(<Register />);

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();

    await userEvent.click(backHomeLink);
    expect(mockedNavigate).toBeCalledWith('/', expect.anything());
  });

  it('handles inputs changes', async () => {
    render(<Register />);

    await fillUpForm(exampleData);

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('validates, that all fields are filled and text fields are trimmed', async () => {
    render(<Register />);

    await fillUpForm({
      firstName: '  ',
      lastName: '  ',
      email: '  ',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        5
      );
    });
  });

  it('validates, that names are valid length', async () => {
    render(<Register />);

    await fillUpForm({
      firstName: 'f'.repeat(config.maxNameLength + 1),
      lastName: 'l'.repeat(config.maxNameLength + 1),
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 10000);

  it('validates e-mail format', async () => {
    render(<Register />);

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

  it('validates password strength', async () => {
    render(<Register />);

    await fillUpForm({
      password: 'weak-password',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.weak').length
      ).toBe(1);
    });
  });

  it('validates passwords match', async () => {
    render(<Register />);

    await fillUpForm({
      password: exampleData.password,
      confirmationPassword: exampleData.confirmationPassword + 'mismatch'
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.password.match').length
      ).toBe(1);
    });
  });

  it('submits correct values', async () => {
    render(<Register />);

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert and redirects to the login page in case of a successful registration request', async () => {
    render(<Register />);

    mockedRegister.mockResolvedValueOnce('mocked-user-id');

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'auth.register.notifications.success'
      );
    });
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and form values remain intact, in case the registration request fails with a status code other than 400', async () => {
    render(<Register />);

    mockedRegister.mockRejectedValueOnce({
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

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });

  it('displays server validations errors and form values remain intact, in case the registration request fails with status code 400', async () => {
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
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(emailError)).toBeInTheDocument();
    });
    expect(screen.getByText(passwordError)).toBeInTheDocument();

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
    expect(getEmailInput()).toHaveValue(exampleData.email);
    expect(getPasswordInput()).toHaveValue(exampleData.password);
    expect(getConfirmPasswordInput()).toHaveValue(
      exampleData.confirmationPassword
    );
  });
});
