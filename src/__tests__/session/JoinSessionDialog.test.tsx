import userEvent from '@testing-library/user-event';
import {
  cancelButton,
  exampleData,
  fillUpForm,
  hashIdInput,
  joinButton,
} from 'helpers/session/JoinSessionDialog.helper';
import * as router from 'react-router';
import JoinSessionDialog from 'session/components/JoinSessionDialog';
import { render, screen, waitFor } from 'test-utils';

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
  ownerId: 'mocked-owner-id',
};

const mockedJoinSession = jest.fn();
jest.mock('session/hooks/useJoinSession', () => ({
  useJoinSession: () => ({
    isJoining: false,
    joinSession: mockedJoinSession,
  }),
}));

const mockedSnackbarSuccess = jest.fn();
const mockedSnackbarError = jest.fn();
jest.mock('core/contexts/SnackbarProvider', () => ({
  useSnackbar: () => ({
    success: mockedSnackbarSuccess,
    error: mockedSnackbarError,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Join session dialog', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(<JoinSessionDialog open={false} onClose={() => {}} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a title and the form correctly', async () => {
    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    expect(screen.getByText('session.dialog.join.title')).toBeInTheDocument();
    expect(hashIdInput()).toBeInTheDocument();
    expect(cancelButton()).toBeInTheDocument();
    expect(joinButton()).toBeInTheDocument();
  });

  it('calls onClose from props, when cancel button is clicked', async () => {
    const mockedOnClose = jest.fn();

    render(<JoinSessionDialog open={true} onClose={mockedOnClose} />);

    await userEvent.click(cancelButton());
    expect(mockedOnClose).toBeCalledTimes(1);
  });

  it('validates and trims the hash id input', async () => {
    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    await userEvent.type(hashIdInput(), '   ');
    await userEvent.click(joinButton());

    await waitFor(() => {
      expect(
        screen.getByText('common.validations.required')
      ).toBeInTheDocument();
    });
  });

  it('handles inputs changes', async () => {
    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    await userEvent.type(hashIdInput(), exampleData.hashId);
    expect(hashIdInput()).toHaveValue(exampleData.hashId);
  });

  it('submits correct values', async () => {
    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    await fillUpForm(exampleData);
    await userEvent.click(joinButton());

    await waitFor(() => {
      expect(mockedJoinSession).toHaveBeenCalledWith(exampleData.hashId);
    });
  });

  it('redirects to voting session in case of successfull join session request', async () => {
    mockedJoinSession.mockResolvedValueOnce({
      matrix: mockedMatrixData,
      session: mockedSessionData,
    });

    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    await fillUpForm(exampleData);
    await userEvent.click(joinButton());

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        `/sessions/${mockedSessionData.hashId}`
      );
    });
  });

  it('calls an error alert and calls onClose from props in case the join request fails with a status code other than 404', async () => {
    const mockedOnClose = jest.fn();

    mockedJoinSession.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<JoinSessionDialog open={true} onClose={mockedOnClose} />);

    await fillUpForm(exampleData);
    await userEvent.click(joinButton());

    await waitFor(() => {
      expect(mockedOnClose).toHaveBeenCalledTimes(1);
    });

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );
  });

  it('displays server validations errors in case the join request fails with status code 404', async () => {
    const hashIdError = 'Voting session with given hash id does not exists';

    mockedJoinSession.mockRejectedValueOnce({
      response: {
        status: 404,
        data: {
          errors: [
            {
              path: 'hashId',
              value: 'invalid-hash-id',
              message: hashIdError,
              location: 'body',
            },
          ],
        },
      },
    });

    render(<JoinSessionDialog open={true} onClose={() => {}} />);

    await fillUpForm(exampleData);
    await userEvent.click(joinButton());

    await waitFor(() => {
      expect(
        screen.getByText(/common.validations.session.id/i)
      ).toBeInTheDocument();
    });
  });
});
