import userEvent from '@testing-library/user-event';
import * as router from 'react-router';
import { render, screen } from 'test-utils';
import Home from 'user/pages/Home';

const userData = {
  id: 'mocked-user-id',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: userData,
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

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Users homepage', () => {
  it('contains a toolbar', () => {
    render(<Home />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('contains a welcome messages', () => {
    render(<Home />);

    expect(screen.getByText('home.welcome.title')).toBeInTheDocument();
    expect(screen.getByText('home.welcome.subTitle')).toBeInTheDocument();
    expect(screen.getByText('home.welcome.message')).toBeInTheDocument();
  });

  it('contains a matrix widget, which navigates to the matrix homepage', async () => {
    render(<Home />);

    const title = screen.getByText('1. home.widgets.createMatrix.title');
    expect(title).toBeInTheDocument();
    await userEvent.click(title);
    expect(mockedNavigate).toBeCalledWith('/matrices');

    expect(
      screen.getByText('home.widgets.createMatrix.subTitle')
    ).toBeInTheDocument();
  });

  it('contains a session widget, which navigates to the session homepage', async () => {
    render(<Home />);

    const title = screen.getByText('2. home.widgets.createSession.title');
    expect(title).toBeInTheDocument();
    await userEvent.click(title);
    expect(mockedNavigate).toBeCalledWith('/sessions');

    expect(
      screen.getByText('home.widgets.createSession.subTitle')
    ).toBeInTheDocument();
  });

  it('contains an invitation widget, which navigates to the session homepage', async () => {
    render(<Home />);

    const title = screen.getByText('3. home.widgets.invite.title');
    expect(title).toBeInTheDocument();
    await userEvent.click(title);
    expect(mockedNavigate).toBeCalledWith('/sessions');

    expect(
      screen.getByText('home.widgets.invite.subTitle')
    ).toBeInTheDocument();
  });

  it('contains a voting widget, which navigates to the session homepage', async () => {
    render(<Home />);

    const title = screen.getByText('4. home.widgets.vote.title');
    expect(title).toBeInTheDocument();
    await userEvent.click(title);
    expect(mockedNavigate).toBeCalledWith('/sessions');

    expect(screen.getByText('home.widgets.vote.subTitle')).toBeInTheDocument();
  });
});
