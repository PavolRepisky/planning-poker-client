import userEvent from '@testing-library/user-event';
import * as router from 'react-router';
import { render, screen } from 'test-utils';
import Home from 'user/pages/Home';

const mockedUserData = {
  id: 1,
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: mockedUserData,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Logged user homepage', () => {
  it('renders a toolbar correctly', () => {
    render(<Home />);

    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders welcome messages correctly', () => {
    render(<Home />);

    expect(screen.getByText('home.welcome.title')).toBeInTheDocument();
    expect(screen.getByText('home.welcome.subTitle')).toBeInTheDocument();
    expect(screen.getByText('home.welcome.message')).toBeInTheDocument();
  });

  it('renders a matrix widget correctly', async () => {
    render(<Home />);

    const title = screen.getByText('1. home.widgets.createMatrix.title');
    expect(title).toBeInTheDocument();
    expect(
      screen.getByText('home.widgets.createMatrix.subTitle')
    ).toBeInTheDocument();

    await userEvent.click(title);

    expect(mockedNavigate).toBeCalledWith('/matrices');
  });

  it('renders a session widget correctly', async () => {
    render(<Home />);

    const title = screen.getByText('2. home.widgets.createSession.title');
    expect(title).toBeInTheDocument();
    expect(
      screen.getByText('home.widgets.createSession.subTitle')
    ).toBeInTheDocument();

    await userEvent.click(title);

    expect(mockedNavigate).toBeCalledWith('/sessions');
  });

  it('renders an invite widget correctly', async () => {
    render(<Home />);

    const title = screen.getByText('3. home.widgets.invite.title');
    expect(title).toBeInTheDocument();
    expect(
      screen.getByText('home.widgets.invite.subTitle')
    ).toBeInTheDocument();

    await userEvent.click(title);

    expect(mockedNavigate).toBeCalledWith('/sessions');
  });

  it('renders a vote widget correctly', async () => {
    render(<Home />);

    const title = screen.getByText('4. home.widgets.vote.title');
    expect(title).toBeInTheDocument();
    expect(screen.getByText('home.widgets.vote.subTitle')).toBeInTheDocument();

    await userEvent.click(title);

    expect(mockedNavigate).toBeCalledWith('/sessions');
  });
});
