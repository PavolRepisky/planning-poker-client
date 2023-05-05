import user from '@testing-library/user-event';
import Landing from 'core/pages/Landing';
import { render, screen, within } from 'test-utils';

describe('Landing page', () => {
  describe('Toolbar', () => {
    it('renders correctly', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();
    });

    it('contains a logo image, which navigates to landing route', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const logoLink = within(toolbar).getByRole('img', {
        name: /logo/i,
      });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('contains a register link, which navigates to register route', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const registerLink = within(toolbar).getByRole('link', {
        name: 'common.register',
      });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });

    it('contains a login link, which navigates to login route', () => {
      render(<Landing />);

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      const loginLink = within(toolbar).getByRole('link', {
        name: 'common.login',
      });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });

    it('contains a settings button', async () => {
      render(<Landing />);
      user.setup();

      const toolbar = screen.getByRole('toolbar');
      expect(toolbar).toBeInTheDocument();

      let settingsButton = within(toolbar).getByRole('button', {
        name: 'common.settings',
      });
      expect(settingsButton).toBeInTheDocument();

      let settingsDrawerTitle = screen.queryByRole('heading', {
        name: 'settings.drawer.title',
      });
      expect(settingsDrawerTitle).not.toBeInTheDocument();
      user.click(settingsButton);

      settingsDrawerTitle = await screen.findByRole('heading', {
        name: 'settings.drawer.title',
      });

      expect(settingsDrawerTitle).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('contains title and app demo', () => {
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

    it('contains a button, to join a session', async () => {
      render(<Landing />);
      user.setup();

      const joinButton = screen.getByRole('button', {
        name: 'landing.join',
      });
      expect(joinButton).toBeInTheDocument();

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      user.click(joinButton);
      const joinSessionDialog = await screen.findByRole('dialog');
      expect(joinSessionDialog).toBeInTheDocument();
    });

    it('contains showcase examples', () => {
      render(<Landing />);

      const showcaseImages = screen.getAllByRole('img');
      expect(showcaseImages.length).toBeGreaterThan(4);
      const showcaseSubtitles = screen.getAllByRole('heading', { level: 2 });
      expect(showcaseSubtitles.length).toBeGreaterThan(3);
      const showcaseDescriptions = screen.getAllByRole('heading', { level: 4 });
      expect(showcaseDescriptions.length).toBeGreaterThan(3);
    });

    it('conatins list of features', () => {
      render(<Landing />);

      const listOfFeatures = screen.getByRole('list');
      expect(listOfFeatures).toBeInTheDocument();

      const listFeatureItems = screen.getAllByRole('listitem');
      expect(listFeatureItems.length).toBeGreaterThan(3);
    });

    it('conatins link to repos', () => {
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
