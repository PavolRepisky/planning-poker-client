import userEvent from '@testing-library/user-event';
import {
  exampleData,
  fillUpForm,
  getDescriptionInput,
  getNameInput,
  getSubmitButton,
} from 'helpers/session/CreateVotingDialog.helper';
import VotingPanel from 'session/components/VotingPanel';
import { render, screen, waitFor } from 'test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
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

const mockedCreateVoting = jest.fn();
jest.mock('session/hooks/useCreateVoting', () => ({
  useCreateVoting: () => ({
    isCreating: false,
    createVoting: mockedCreateVoting,
  }),
}));

describe('Voting panel', () => {
  describe('Non-Admin', () => {
    it('contains a waiting message, if no voting is active', () => {
      render(
        <VotingPanel
          isAdmin={false}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={undefined}
        />
      );

      expect(screen.getByText('session.waiting')).toBeInTheDocument();
    });

    it('contains a voting data, if voting is active', () => {
      render(
        <VotingPanel
          isAdmin={false}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      expect(screen.getByText(exampleData.name)).toBeInTheDocument();
      expect(screen.getByText(exampleData.description)).toBeInTheDocument();
    });

    it('does not contain create voting nor show votes buttons', () => {
      render(
        <VotingPanel
          isAdmin={false}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      expect(
        screen.queryByRole('button', {
          name: 'session.createVoting',
        })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', {
          name: 'session.showVotes',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('Admin', () => {
    it('contains a start message, if no voting is active', () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={undefined}
        />
      );

      expect(screen.getByText('session.toStart')).toBeInTheDocument();
    });

    it('contains a voting data, if voting is active', () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      expect(screen.getByText(exampleData.name)).toBeInTheDocument();
      expect(screen.getByText(exampleData.description)).toBeInTheDocument();
    });

    it('contains create voting button, which opens create voting dialog', async () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      const createVotingButton = screen.getByRole('button', {
        name: 'session.createVoting',
      });
      expect(createVotingButton).toBeInTheDocument();

      await userEvent.click(createVotingButton);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('submits correct values', async () => {
      const mockedSessionHashId = 'mocked-session-id';
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId={mockedSessionHashId}
          voting={exampleData}
        />
      );

      await userEvent.click(
        screen.getByRole('button', {
          name: 'session.createVoting',
        })
      );
      await fillUpForm(exampleData);
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockedCreateVoting).toHaveBeenCalledWith({
          sessionHashId: mockedSessionHashId,
          votingData: exampleData,
        });
      });
    });

    it('calls a success alert, closes dialog and call onCreateSuccess from props, in case of successfull create voting request', async () => {
      const mockedOnCreateSuccess = jest.fn();
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={mockedOnCreateSuccess}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      mockedCreateVoting.mockResolvedValueOnce(exampleData);

      await userEvent.click(
        screen.getByRole('button', {
          name: 'session.createVoting',
        })
      );
      await fillUpForm(exampleData);
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      expect(mockedSnackbarSuccess).toBeCalledWith(
        'session.dialog.createVoting.notifications.success'
      );
      expect(mockedOnCreateSuccess).toBeCalledTimes(1);
    });

    it('calls an error alert and dialog values remains intact, if create voting request fails with status code other than 404', async () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      mockedCreateVoting.mockRejectedValueOnce({
        response: {
          status: 500,
        },
      });

      await userEvent.click(
        screen.getByRole('button', {
          name: 'session.createVoting',
        })
      );
      await fillUpForm(exampleData);
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(mockedSnackbarError).toBeCalledWith(
          'common.errors.unexpected.subTitle'
        );
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(getNameInput()).toHaveValue(exampleData.name);
      expect(getDescriptionInput()).toHaveValue(exampleData.description);
    });

    it('displays server validations errors and dialog remains intact, in case create voting request fails with status code 400', async () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      const nameError = 'Field is required';
      const descriptionError = 'Value is too long';

      mockedCreateVoting.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            errors: [
              {
                path: 'name',
                value: '',
                message: nameError,
                location: 'body',
              },
              {
                path: 'description',
                value: 'too-long-value',
                message: descriptionError,
                location: 'body',
              },
            ],
          },
        },
      });

      await userEvent.click(
        screen.getByRole('button', {
          name: 'session.createVoting',
        })
      );
      await fillUpForm(exampleData);
      await userEvent.click(getSubmitButton());

      await waitFor(() => {
        expect(screen.getByText(nameError)).toBeInTheDocument();
      });
      expect(screen.getByText(descriptionError)).toBeInTheDocument();

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(getNameInput()).toHaveValue(exampleData.name);
      expect(getDescriptionInput()).toHaveValue(exampleData.description);
    });

    it('contains a show votes button, which calls onShowVotes function from props', async () => {
      const mockedOnShowVotes = jest.fn();
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={mockedOnShowVotes}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      const showVotesButton = screen.getByRole('button', {
        name: 'session.showVotes',
      });
      expect(showVotesButton).toBeInTheDocument();

      await userEvent.click(showVotesButton);

      expect(mockedOnShowVotes).toBeCalledTimes(1);
    });

    it('show votes button is disabled if votes are already shown', async () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={true}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
          voting={exampleData}
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'session.showVotes',
        })
      ).toBeDisabled();
    });

    it('show votes button is disabled if no voting is active', async () => {
      render(
        <VotingPanel
          isAdmin={true}
          showVotes={false}
          onCreateSuccess={() => {}}
          onShowVotes={() => {}}
          sessionHashId="mocked-session-id"
        />
      );

      expect(
        screen.getByRole('button', {
          name: 'session.showVotes',
        })
      ).toBeDisabled();
    });
  });
});
