import userEvent from '@testing-library/user-event';
import {
  cancelButton,
  createButton,
  exampleData,
  fillUpForm,
  matrixIdInput,
  nameInput,
} from 'helpers/session/CreateSessionDialog.helper';
import * as router from 'react-router';
import CreateSessionDialog from 'session/components/CreateSessionDialog';
import { render, screen, waitFor, within } from 'test-utils';

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

const mockedSessionData = {
  id: 1,
  hashId: 'mocked-hash-id',
  name: 'Mocked Session',
  matrixId: matricesData[0].id,
  ownerId: 'mocked-owner-id',
};

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

  it('contains a form title', async () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    expect(
      screen.getByRole('heading', {
        name: /session.dialog.create.title/i,
      })
    ).toBeInTheDocument();
  });

  it('contains a form', async () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    expect(nameInput()).toBeInTheDocument();
    expect(matrixIdInput()).toBeInTheDocument();
    expect(createButton()).toBeInTheDocument();
    expect(cancelButton()).toBeInTheDocument();
  });

  it('matrix id field contains correct options', async () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await userEvent.click(matrixIdInput());

    const optionsList = screen.getByRole('listbox', {
      name: /session.dialog.create.form.matrixId.label/i,
    });
    expect(optionsList).toBeInTheDocument();

    matricesData.forEach((matrix) => {
      expect(
        within(optionsList).getByRole('option', {
          name: matrix.name,
        })
      ).toBeInTheDocument();
    });
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

  it('handles inputs changes', async () => {
    const matrixIdx = 0;

    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await userEvent.type(nameInput(), exampleData.name);
    await waitFor(() => {
      expect(nameInput()).toHaveValue(exampleData.name);
    });

    await userEvent.click(matrixIdInput());

    const optionsList = screen.getByRole('listbox', {
      name: /session.dialog.create.form.matrixId.label/i,
    });
    const option = within(optionsList).getByRole('option', {
      name: matricesData[matrixIdx].name,
    });

    await userEvent.click(option);

    await waitFor(() => {
      expect(matrixIdInput()).toHaveTextContent(
        `${matricesData[matrixIdx].id}`
      );
    });
  });

  it('validates, that all inputs are filled and trims name', async () => {
    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await userEvent.type(nameInput(), '   ');
    await userEvent.click(createButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('redirects to voting session in case of successfull create session request', async () => {
    mockedCreateSession.mockResolvedValueOnce(mockedSessionData);
    const matrix = matricesData[0];

    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await fillUpForm({ name: 'Mocked Session', matrixName: matrix.name });
    await userEvent.click(createButton());

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(
        `/sessions/${mockedSessionData.hashId}`
      );
    });

    expect(mockedSnackbarSuccess).toBeCalledWith(
      'session.dialog.create.notifications.success'
    );
  });

  it('calls an error alert and form values remain intact, in case create session request fails with a status code other than 400', async () => {
    const matrix = matricesData[0];

    mockedCreateSession.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await fillUpForm({ name: mockedSessionData.name, matrixName: matrix.name });
    await userEvent.click(createButton());

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(nameInput()).toHaveValue(mockedSessionData.name);
    expect(matrixIdInput()).toHaveTextContent(`${matrix.id}`);
  });

  it('displays server validations errors and form values remain intact, in case the create session request fails with status code 400', async () => {
    const nameError = 'Value is too long';
    const matrixIdError = 'Invalid matrix id';
    const matrix = matricesData[0];

    mockedCreateSession.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'name',
              value: 'too-long-name',
              message: nameError,
              location: 'body',
            },
            {
              path: 'matrixId',
              value: 'invalid-matrix-id',
              message: matrixIdError,
              location: 'body',
            },
          ],
        },
      },
    });

    render(
      <CreateSessionDialog
        open={true}
        onClose={() => {}}
        matrices={matricesData}
      />
    );

    await fillUpForm({ name: mockedSessionData.name, matrixName: matrix.name });
    await userEvent.click(createButton());

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });

    expect(screen.getByText(matrixIdError)).toBeInTheDocument();
  });
});
