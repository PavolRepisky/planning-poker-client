import userEvent from '@testing-library/user-event';
import {
  cancelButton,
  createButton,
  matrixIdInput,
  nameInput,
} from 'helpers/session/CreateSessionDialog.helper';
import * as router from 'react-router';
import CreateSessionDialog from 'session/components/CreateSessionDialog';
import { render, screen, waitFor } from 'test-utils';

const matricesData = [
  {
    id: 1,
    name: 'Mocked Matrix 1',
    rows: 2,
    columns: 2,
    values: [['1', '2'], ['3, 4']],
    createdAt: 123,
  },
  {
    id: 2,
    name: 'Mocked Matrix 2',
    rows: 2,
    columns: 2,
    values: [['1', '2'], ['3, 4']],
    createdAt: 124,
  },
  {
    id: 3,
    name: 'Mocked Matrix 3',
    rows: 3,
    columns: 2,
    values: [['1', '2'], ['3, 4'], ['5, 6']],
    createdAt: 125,
  },
];

const mockedCreateSession = jest.fn();
jest.mock('session/hooks/useCreateSession', () => ({
  useCreateSession: () => ({
    isCreating: false,
    createSession: mockedCreateSession,
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

describe('Create session dialog', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(
      <CreateSessionDialog
        open={false}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders a title and the form correctly', async () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: /session.dialog.create.title/i,
        })
      ).toBeInTheDocument();
    });

    expect(nameInput()).toBeInTheDocument();
    expect(matrixIdInput()).toBeInTheDocument();

    await userEvent.click(matrixIdInput());

    const optionsList = screen.getByRole('listbox', {
      name: /session.dialog.create.form.matrixId.label/i,
    });
    expect(optionsList).toBeInTheDocument();
    matricesData.forEach((matrix) => {
      expect(
        screen.getByRole('option', {
          name: matrix.name,
        })
      ).toBeInTheDocument();
    });

    await userEvent.click(matrixIdInput());

    expect(createButton()).toBeInTheDocument();
    expect(cancelButton()).toBeInTheDocument();
  });

  it('calls onClose from props, when cancel button is clicked', async () => {
    const mockedOnClose = jest.fn();

    render(
      <CreateSessionDialog
        open={true}
        onClose={mockedOnClose}
        matrices={matricesData}
      />
    );

    await userEvent.click(cancelButton());
    expect(mockedOnClose).toBeCalledTimes(1);
  });
});
