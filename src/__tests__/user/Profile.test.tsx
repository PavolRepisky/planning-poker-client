import userEvent from '@testing-library/user-event';
import * as router from 'react-router';
import { render, screen, within } from 'test-utils';
import Profile from 'user/pages/Profile';

const mockedUserData = {
  id: 1,
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};
const mockedLogout = jest.fn();

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: mockedUserData,
    logout: mockedLogout,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Profile information page', () => {
  it('renders a toolbar correctly', async () => {
    render(<Profile />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();

    const logoutButton = within(toolbar).getByRole('button', {
      name: /logout/i,
    });
    expect(logoutButton).toBeInTheDocument();

    await userEvent.click(logoutButton);
    expect(mockedLogout).toBeCalledTimes(1);
  });

  it('renders a user data and person icon correctly', async () => {
    render(<Profile />);

    expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();

    expect(
      screen.getByText(`${mockedUserData.firstName} ${mockedUserData.lastName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockedUserData.email)).toBeInTheDocument();
  });
});
