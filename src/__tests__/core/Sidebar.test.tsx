import userEvent from '@testing-library/user-event';
import Sidebar from 'core/components/Sidebar';
import * as router from 'react-router';
import { render, screen, within } from 'test-utils';

const userData = {
  id: 'mocked-user-id',
  firstName: 'joe',
  lastName: 'doe',
  email: 'joe@doe.com',
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData,
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

describe('Sidebar', () => {
  it('is in the document', () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('contains a logo, which navigates to the users homepage', async () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    const sidebar = screen.getByTestId('sidebar');

    const logoIcon = within(sidebar).getByTestId('LogoDevIcon');
    expect(logoIcon).toBeInTheDocument();

    await userEvent.click(logoIcon);
    expect(mockedNavigate).toBeCalledWith('/home', expect.anything());
  });

  it('contains a home link with icon, which navigates to the users homepage', async () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    const homeLink = screen.getByRole('link', {
      name: 'sidebar.menu.home',
    });
    expect(homeLink).toBeInTheDocument();

    expect(within(homeLink).getByTestId('HomeIcon')).toBeInTheDocument();

    expect(within(homeLink).getByText('sidebar.menu.home')).toBeInTheDocument();

    await userEvent.click(homeLink);
    expect(mockedNavigate).toBeCalledWith('/home', expect.anything());
  });

  it('contains a matrix link with icon, which navigates to the matrix homepage', async () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    const matrixLink = screen.getByRole('link', {
      name: 'sidebar.menu.matrix',
    });
    expect(matrixLink).toBeInTheDocument();

    expect(within(matrixLink).getByTestId('StyleIcon')).toBeInTheDocument();

    expect(
      within(matrixLink).getByText('sidebar.menu.matrix')
    ).toBeInTheDocument();

    await userEvent.click(matrixLink);
    expect(mockedNavigate).toBeCalledWith('/matrices', expect.anything());
  });

  it('contains a session link with icon, which navigates to the session homepage', async () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    const sessionLink = screen.getByRole('link', {
      name: 'sidebar.menu.session',
    });
    expect(sessionLink).toBeInTheDocument();

    expect(
      within(sessionLink).getByTestId('HowToVoteIcon')
    ).toBeInTheDocument();

    expect(
      within(sessionLink).getByText('sidebar.menu.session')
    ).toBeInTheDocument();

    await userEvent.click(sessionLink);
    expect(mockedNavigate).toBeCalledWith('/sessions', expect.anything());
  });

  it('contains a person link with icon, which navigates to the profile page', async () => {
    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={() => {}}
        mobileOpen={false}
      />
    );

    const profileLink = screen.getByRole('link', {
      name: `${userData.firstName} ${userData.lastName}`,
    });
    expect(profileLink).toBeInTheDocument();

    expect(within(profileLink).getByTestId('PersonIcon')).toBeInTheDocument();

    expect(
      within(profileLink).getByText(
        `${userData.firstName} ${userData.lastName}`
      )
    ).toBeInTheDocument();

    await userEvent.click(profileLink);
    expect(mockedNavigate).toBeCalledWith('/profile', expect.anything());
  });

  it('contains a settings button with icon, which calls the onSettingsToggle from props', async () => {
    const mockedOnSettingsToggle = jest.fn();

    render(
      <Sidebar
        collapsed={false}
        onDrawerToggle={() => {}}
        onSettingsToggle={mockedOnSettingsToggle}
        mobileOpen={false}
      />
    );

    const settingsIcon = screen.getByRole('button', {
      name: 'sidebar.menu.settings',
    });
    expect(settingsIcon).toBeInTheDocument();

    expect(
      within(settingsIcon).getByTestId('SettingsIcon')
    ).toBeInTheDocument();

    expect(
      within(settingsIcon).getByText('sidebar.menu.settings')
    ).toBeInTheDocument();

    await userEvent.click(settingsIcon);
    expect(mockedOnSettingsToggle).toBeCalledTimes(1);
  });
});
