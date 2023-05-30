import userEvent from '@testing-library/user-event';
import SessionHomepage from 'session/pages/SessionHomepage';
import { render, screen, within } from 'test-utils';

jest.mock('matrix/hooks/useGetMatrices', () => ({
  useGetMatrices: () => ({
    data: [],
  }),
}));

jest.mock('session/hooks/useJoinSession', () => ({
  useJoinSession: () => ({
    isJoining: false,
    joinSession: jest.fn(),
  }),
}));

jest.mock('session/hooks/useCreateSession', () => ({
  useCreateSession: () => ({
    isCreating: false,
    createSession: jest.fn(),
  }),
}));

describe('Session homepage', () => {
  it('contains a toolbar', async () => {
    render(<SessionHomepage />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();

    expect(
      within(toolbar).getByRole('heading', {
        name: 'session.homepage.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a create session button, which opens create session dialog', async () => {
    render(<SessionHomepage />);

    const createButton = screen.getByRole('button', {
      name: 'session.homepage.create',
    });
    expect(createButton).toBeInTheDocument();

    await userEvent.click(createButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'session.dialog.create.title',
      })
    ).toBeInTheDocument();
  });

  it('contains a join session buttons, which opens join session dialog', async () => {
    render(<SessionHomepage />);

    const joinButton = screen.getByRole('button', {
      name: 'session.homepage.join',
    });
    expect(joinButton).toBeInTheDocument();

    await userEvent.click(joinButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'session.dialog.join.title',
      })
    ).toBeInTheDocument();
  });
});
