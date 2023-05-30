import userEvent from '@testing-library/user-event';
import Landing from 'core/pages/Landing';
import {
  getLogo,
  getSettingsButton,
  getToolbar,
} from 'helpers/core/Toolbar.helper';
import * as router from 'react-router';
import { render, screen, waitFor, within } from 'test-utils';

jest.mock('core/components/SettingsDrawer', () => {
  return (props: any) =>
    props.open ? <div data-testid="settings-drawer" /> : <></>;
});

jest.mock('session/components/JoinSessionDialog', () => {
  return (props: any) =>
    props.open ? <div data-testid="join-session-dialog" /> : <></>;
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
    i18n: {
      language: 'en',
    },
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Landing page', () => {
  describe('Toolbar', () => {
    it('is in the document', () => {
      render(<Landing />);

      expect(getToolbar()).toBeInTheDocument();
    });

    it('contains a logo, which navigates to the landing page', async () => {
      render(<Landing />);

      const logo = getLogo();
      expect(logo).toBeInTheDocument();

      await userEvent.click(logo);
      expect(mockedNavigate).toBeCalledWith('/', expect.anything());
    });

    it('contains a register link, which navigates to the registration page', async () => {
      render(<Landing />);

      const registerLink = within(getToolbar()).getByRole('link', {
        name: 'common.register',
      });
      expect(registerLink).toBeInTheDocument();

      await userEvent.click(registerLink);
      expect(mockedNavigate).toBeCalledWith('/register', expect.anything());
    });

    it('contains a login link, which navigates to the login page', async () => {
      render(<Landing />);

      const loginLink = within(getToolbar()).getByRole('link', {
        name: 'common.login',
      });
      expect(loginLink).toBeInTheDocument();

      await userEvent.click(loginLink);
      expect(mockedNavigate).toBeCalledWith('/login', expect.anything());
    });

    it('contains a settings button, which the opens settings drawer', async () => {
      render(<Landing />);

      const settingsButton = getSettingsButton();
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();

      await userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
      });
    });
  });

  it('contains a page title', () => {
    render(<Landing />);

    expect(
      screen.getByRole('heading', {
        name: 'landing.title',
        level: 1,
      })
    ).toBeInTheDocument();
  });

  it('renders an app demo image', () => {
    render(<Landing />);

    expect(
      screen.getByRole('img', {
        name: 'landing.altDemo',
      })
    ).toBeInTheDocument();
  });

  it('contains a join session button, which opens the join session dialog', async () => {
    render(<Landing />);

    const joinButton = screen.getByRole('button', {
      name: 'landing.join',
    });

    expect(joinButton).toBeInTheDocument();
    expect(screen.queryByTestId('joinSessionDialog')).not.toBeInTheDocument();

    await userEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByTestId('join-session-dialog')).toBeInTheDocument();
    });
  });

  it('renders showcase examples', () => {
    render(<Landing />);

    expect(screen.getAllByRole('img').length).toBeGreaterThan(3);
    expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(
      3
    );
    expect(screen.getAllByRole('heading', { level: 4 }).length).toBeGreaterThan(
      3
    );
  });

  it('contains a list of features', () => {
    render(<Landing />);

    const listOfFeatures = screen.getByRole('list');
    expect(listOfFeatures).toBeInTheDocument();

    expect(
      within(listOfFeatures).getAllByRole('listitem').length
    ).toBeGreaterThan(3);
  });

  it('contains links to the project repositories', () => {
    render(<Landing />);

    expect(
      screen.getByRole('link', {
        name: 'landing.links.api',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: 'landing.links.client',
      })
    ).toBeInTheDocument();
  });

  it('contains a copyright footer', () => {
    render(<Landing />);

    expect(
      screen.getByText(new RegExp(`^©.* ${new Date().getFullYear()}$`))
    ).toBeInTheDocument();
  });
});
