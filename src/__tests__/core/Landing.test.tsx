import userEvent from '@testing-library/user-event';
import Landing from 'core/pages/Landing';
import { render, screen, waitFor, within } from 'test-utils';

jest.mock('core/components/SettingsDrawer', () => {
  const MockedSettingsDrawer = (props: any) => {
    if (!props.open) {
      return <></>;
    }
    return <div data-testid="settingsDrawer" />;
  };
  return MockedSettingsDrawer;
});

jest.mock('session/components/JoinSessionDialog', () => {
  const MockedJoinSessionDialog = (props: any) => {
    if (!props.open) {
      return <></>;
    }
    return <div data-testid="joinSessionDialog" />;
  };
  return MockedJoinSessionDialog;
});

describe('Landing page', () => {
  describe('Toolbar', () => {
    it('renders correctly', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('renders a logo image, which navigates to landing page', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const logoLink = within(toolbar).getByRole('img', {
        name: /logo/i,
      });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('renders a register link, which navigates to registration page', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const registerLink = within(toolbar).getByRole('link', {
        name: 'common.register',
      });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('renders a login link, which navigates to login page', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const loginLink = within(toolbar).getByRole('link', {
        name: 'common.login',
      });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('renders a settings button, which opens settings drawer', async () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const settingsButton = within(toolbar).getByRole('button', {
        name: 'common.settings',
      });
      expect(settingsButton).toBeInTheDocument();

      expect(screen.queryByTestId('settingsDrawer')).not.toBeInTheDocument();
      userEvent.click(settingsButton);

      await waitFor(() => {
        expect(screen.getByTestId('settingsDrawer')).toBeInTheDocument();
      });
    });
  });

  describe('Body', () => {
    it('renders title and app demo', () => {
      render(<Landing />);

      const demoImage = screen.getByRole('img', {
        name: 'landing.altDemo',
      });
      expect(demoImage).toBeInTheDocument();

      const title = screen.getByRole('heading', {
        level: 1,
        name: 'landing.title',
      });
      expect(title).toBeInTheDocument();
    });

    it('renders a join session button, which opens join a session dialog', async () => {
      render(<Landing />);

      const joinButton = screen.getByRole('button', {
        name: 'landing.join',
      });
      expect(joinButton).toBeInTheDocument();

      expect(screen.queryByTestId('joinSessionDialog')).not.toBeInTheDocument();
      await userEvent.click(joinButton);

      await waitFor(() => {
        expect(screen.getByTestId('joinSessionDialog')).toBeInTheDocument();
      });
    });

    it('renders showcase examples', () => {
      render(<Landing />);

      const showcaseImages = screen.getAllByRole('img');
      expect(showcaseImages.length).toBeGreaterThan(4);
      const showcaseSubtitles = screen.getAllByRole('heading', { level: 2 });
      expect(showcaseSubtitles.length).toBeGreaterThan(3);
      const showcaseDescriptions = screen.getAllByRole('heading', { level: 4 });
      expect(showcaseDescriptions.length).toBeGreaterThan(3);
    });

    it('renders list of features', () => {
      render(<Landing />);

      const listOfFeatures = screen.getByRole('list');
      expect(listOfFeatures).toBeInTheDocument();

      const listFeatureItems = screen.getAllByRole('listitem');
      expect(listFeatureItems.length).toBeGreaterThan(3);
    });

    it('renders link to repos', () => {
      render(<Landing />);

      const apiLink = screen.getByRole('link', {
        name: 'landing.links.api',
      });
      expect(apiLink).toBeInTheDocument();

      const clientLink = screen.getByRole('link', {
        name: 'landing.links.client',
      });
      expect(clientLink).toBeInTheDocument();
    });
  });
});
