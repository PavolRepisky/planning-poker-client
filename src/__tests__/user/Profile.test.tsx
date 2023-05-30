import userEvent from '@testing-library/user-event';
import { getToolbar } from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, within } from 'test-utils';
import Profile from 'user/pages/Profile';

const userData = {
  id: 'mocked-user-id',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

const mockedLogout = jest.fn();
jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: userData,
    logout: mockedLogout,
  }),
}));

jest.mock('core/components/SettingsDrawer', () => {
  return (props: any) =>
    props.open ? <div data-testid="settings-drawer" /> : <></>;
});

const mockedSnackbarSuccess = jest.fn();
const mockedSnackbarError = jest.fn();
jest.mock('core/contexts/SnackbarProvider', () => ({
  useSnackbar: () => ({
    success: mockedSnackbarSuccess,
    error: mockedSnackbarError,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Profile information page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<Profile />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logout button, which logouts user from the app', async () => {
      render(<Profile />);

      const logoutButton = within(screen.getByRole('toolbar')).getByRole(
        'button',
        {
          name: /logout/i,
        }
      );
      expect(logoutButton).toBeInTheDocument();

      await userEvent.click(logoutButton);
      expect(mockedLogout).toBeCalledTimes(1);
    });
  });

  it('contains a user name and email and person icon', async () => {
    render(<Profile />);

    expect(
      screen.getByText(`${userData.firstName} ${userData.lastName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(userData.email)).toBeInTheDocument();

    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
  });

  it('contains an information tab, which navigates to the profile information page', async () => {
    render(<Profile />);

    const infoTab = screen.getByRole('tab', {
      name: 'profile.menu.info',
    });
    expect(infoTab).toBeInTheDocument();

    await userEvent.click(infoTab);
    expect(mockedNavigate).toBeCalledWith('', expect.anything());
  });

  it('contains a password tab, which navigates to the profile password page', async () => {
    render(<Profile />);

    const passwordTab = screen.getByRole('tab', {
      name: 'profile.menu.password',
    });
    expect(passwordTab).toBeInTheDocument();

    await userEvent.click(passwordTab);
    expect(mockedNavigate).toBeCalledWith('./password', expect.anything());
  });
});
