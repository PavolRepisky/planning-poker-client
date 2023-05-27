import * as router from 'react-router';
import SessionJoinManager from 'session/pages/SessionJoinManager';
import { render, screen, waitFor, within } from 'test-utils';
import UserData from 'user/types/userData';

let mockedUserData: UserData | undefined = {
  id: 'mocked-user-id',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

const mockedMatrixData = {
  id: 1,
  name: 'Mocked Matrix',
  rows: 2,
  columns: 2,
  values: [
    ['1', '2'],
    ['3', '4'],
  ],
  createdAt: 123,
};

const mockedSessionData = {
  id: 1,
  hashId: 'mocked-hash-id',
  name: 'Mocked Session',
  matrixId: mockedMatrixData.id,
  ownerId: mockedUserData,
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: mockedUserData,
  }),
}));

jest.mock('session/components/VotingSession', () => {
  return (props: any) => <div data-testid="voting-session" />;
});

jest.mock('session/components/GuestForm', () => {
  return (props: any) => <div data-testid="guest-form" />;
});

const mockedJoinSession = jest.fn();
jest.mock('session/hooks/useJoinSession', () => ({
  useJoinSession: () => ({
    isJoining: false,
    joinSession: mockedJoinSession,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Session join manager page', () => {
  it('redirect to 404 page in case of wrong session id', async () => {
    mockedJoinSession.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<SessionJoinManager />);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/404');
    });
  });

  it('renders voting session in case ouser is logged in', async () => {
    mockedJoinSession.mockResolvedValueOnce({
      matrix: mockedMatrixData,
      session: mockedSessionData,
    });

    render(<SessionJoinManager />);

    await waitFor(() => {
      expect(screen.getByTestId('voting-session')).toBeInTheDocument();
    });
  });

  it('renders guest page with form if user is not logged in', async () => {
    mockedJoinSession.mockResolvedValueOnce({
      matrix: mockedMatrixData,
      session: mockedSessionData,
    });

    mockedUserData = undefined;

    render(<SessionJoinManager />);

    await waitFor(() => {
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    const toolbar = screen.getByRole('toolbar');
    expect(
      within(toolbar).getByRole('button', {
        name: /settings/i,
      })
    ).toBeInTheDocument();

    expect(
      within(toolbar).getByRole('link', {
        name: process.env.REACT_APP_NAME,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /session.join.guest.title/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByTestId('guest-form')).toBeInTheDocument();
  });
});
