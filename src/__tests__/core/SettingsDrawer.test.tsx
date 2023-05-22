import userEvent from '@testing-library/user-event';
import SettingsDrawer from 'core/components/SettingsDrawer';
import { render, screen, within } from 'test-utils';

const mockedChangeLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockedChangeLanguage,
    },
    t: (value: string) => value,
  }),
}));

const mockedChangeMode = jest.fn();
const mockedChangeDirection = jest.fn();
const mockedChangeCollapsed = jest.fn();
jest.mock('core/contexts/SettingsProvider', () => ({
  useSettings: () => ({
    changeMode: mockedChangeMode,
    changeDirection: mockedChangeDirection,
    changeCollapsed: mockedChangeCollapsed,
  }),
}));

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: {
      id: 1,
      firstName: 'joe',
      lastName: 'doe',
      email: 'joe@doe.com',
    },
  }),
}));

describe('Settings drawer', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    expect(screen.getByTestId('settings-drawer')).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(<SettingsDrawer open={false} onDrawerToggle={() => {}} />);

    expect(screen.queryByTestId('settings-drawer')).not.toBeInTheDocument();
  });

  it('renders a title', () => {
    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    const settingsDrawer = screen.getByTestId('settings-drawer');

    expect(
      within(settingsDrawer).getByRole('heading', {
        name: 'settings.drawer.title',
      })
    ).toBeInTheDocument();
  });

  it('renders a close button and calls onDrawerTogle from props, when clicked', async () => {
    const mockedOnDrawerToggle = jest.fn();
    render(
      <SettingsDrawer open={true} onDrawerToggle={mockedOnDrawerToggle} />
    );

    const settingsDrawer = screen.getByTestId('settings-drawer');
    const closeButton = within(settingsDrawer).getByTestId('CloseIcon');

    await userEvent.click(closeButton);

    expect(mockedOnDrawerToggle).toBeCalledTimes(1);
  });

  it('renders a language title and radio buttons, when one of them is clicked language is changed', async () => {
    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    expect(
      screen.getByRole('heading', {
        name: 'settings.drawer.language.label',
      })
    ).toBeInTheDocument();

    const slovakOption = screen.getByRole('radio', {
      name: 'settings.drawer.language.options.sk',
    });
    expect(slovakOption).toBeInTheDocument();

    const englishOption = screen.getByRole('radio', {
      name: 'settings.drawer.language.options.en',
    });
    expect(englishOption).toBeInTheDocument();

    await userEvent.click(slovakOption);
    expect(mockedChangeLanguage).toBeCalledWith('sk');

    await userEvent.click(englishOption);
    expect(mockedChangeLanguage).toBeCalledWith('en');
  });

  it('renders a theme mode title and toggle buttons, when one of them is clicked theme is changed', async () => {
    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    expect(
      screen.getByRole('heading', {
        name: 'settings.drawer.mode.label',
      })
    ).toBeInTheDocument();

    const lightOption = screen.getByRole('button', {
      name: 'settings.drawer.mode.options.light',
    });
    expect(lightOption).toBeInTheDocument();

    const darkOption = screen.getByRole('button', {
      name: 'settings.drawer.mode.options.dark',
    });
    expect(darkOption).toBeInTheDocument();

    await userEvent.click(lightOption);
    expect(mockedChangeMode).toBeCalledWith('light');

    await userEvent.click(darkOption);
    expect(mockedChangeMode).toBeCalledWith('dark');
  });

  it('renders a direction title and toggle buttons, when one of them is clicked direction is changed', async () => {
    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    expect(
      screen.getByRole('heading', {
        name: 'settings.drawer.direction.label',
      })
    ).toBeInTheDocument();

    const ltrOption = screen.getByRole('button', {
      name: 'settings.drawer.direction.options.ltr',
    });
    expect(ltrOption).toBeInTheDocument();

    const rtlOption = screen.getByRole('button', {
      name: 'settings.drawer.direction.options.rtl',
    });
    expect(rtlOption).toBeInTheDocument();

    await userEvent.click(ltrOption);
    expect(mockedChangeDirection).toBeCalledWith('ltr');

    await userEvent.click(rtlOption);
    expect(mockedChangeDirection).toBeCalledWith('rtl');
  });

  it('renders a sidebar title and toggle buttons, if user is logged in, when one of them is clicked sidebar mode is changed', async () => {

    render(<SettingsDrawer open={true} onDrawerToggle={() => {}} />);

    expect(
      screen.getByRole('heading', {
        name: 'settings.drawer.sidebar.label',
      })
    ).toBeInTheDocument();

    const collapsedOption = screen.getByRole('button', {
      name: 'settings.drawer.sidebar.options.collapsed',
    });
    expect(collapsedOption).toBeInTheDocument();

    const fullOption = screen.getByRole('button', {
      name: 'settings.drawer.sidebar.options.full',
    });
    expect(fullOption).toBeInTheDocument();

    await userEvent.click(collapsedOption);
    expect(mockedChangeCollapsed).toBeCalledWith(true);

    await userEvent.click(fullOption);
    expect(mockedChangeCollapsed).toBeCalledWith(false);
  });
});
