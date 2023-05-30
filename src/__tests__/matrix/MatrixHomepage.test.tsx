import userEvent from '@testing-library/user-event';
import { getConfirmButton } from 'helpers/core/ConfirmDialog.helper';
import { getToolbar } from 'helpers/core/Toolbar.helper';
import {
  exampleData,
  fillUpForm,
  getAddButton as getDialogAddButton,
  getEditButton as getDialogEditButton,
  getNameInput,
  getValuesInputs,
} from 'helpers/matrix/MatrixDialog.helper';
import {
  getActionsButton,
  getAddButton,
  getDeleteAction,
  getEditAction,
  getViewAction,
} from 'helpers/matrix/MatrixHomepage.helper';
import MatrixHomepage from 'matrix/pages/MatrixHomepage';
import * as router from 'react-router';
import { render, screen, waitFor, within } from 'test-utils';

const matricesData = [
  {
    id: 1,
    name: 'Test Matrix 1',
    rows: 2,
    columns: 2,
    values: [['1', '2'], ['3, 4']],
    createdAt: 1685389767079,
  },
  {
    id: 2,
    name: 'Test Matrix 2',
    rows: 2,
    columns: 2,
    values: [['1', '2'], ['3, 4']],
    createdAt: 1482369761073,
  },
  {
    id: 3,
    name: 'Test Matrix 3',
    rows: 3,
    columns: 2,
    values: [['1', '2'], ['3, 4'], ['5, 6']],
    createdAt: 1224367761570,
  },
];

let mockedMatricesData = matricesData;
jest.mock('matrix/hooks/useGetMatrices', () => ({
  useGetMatrices: () => ({
    data: mockedMatricesData,
  }),
}));

const mockedCreateMatrix = jest.fn();
jest.mock('matrix/hooks/useCreateMatrix', () => ({
  useCreateMatrix: () => ({
    isCreating: false,
    createMatrix: mockedCreateMatrix,
  }),
}));

const mockedUpdateMatrix = jest.fn();
jest.mock('matrix/hooks/useUpdateMatrix', () => ({
  useUpdateMatrix: () => ({
    isUpdating: false,
    updateMatrix: mockedUpdateMatrix,
  }),
}));

const mockedDeleteMatrix = jest.fn();
jest.mock('matrix/hooks/useDeleteMatrix', () => ({
  useDeleteMatrix: () => ({
    isDeleting: false,
    deleteMatrix: mockedDeleteMatrix,
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Matrix homepage', () => {
  describe('Toolbar', () => {
    it('contains a matrix homepage title', async () => {
      mockedMatricesData = [];

      render(<MatrixHomepage />);

      const toolbar = getToolbar();
      expect(
        within(toolbar).getByRole('heading', {
          name: 'matrix.toolbar.title',
        })
      ).toBeInTheDocument();
    });

    it('contains an add button, which opens a matrix dialog', async () => {
      mockedMatricesData = [];

      render(<MatrixHomepage />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      await userEvent.click(getAddButton());

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  it('renders no matrices message in case of empty matrices array', async () => {
    mockedMatricesData = [];

    render(<MatrixHomepage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'matrix.table.empty',
        })
      ).toBeInTheDocument();
    });
  });

  it('renders matrices table correctly', async () => {
    mockedMatricesData = matricesData;

    render(<MatrixHomepage />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', {
        name: /^matrix.table.headers.name/i,
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', {
        name: /^matrix.table.headers.rows/i,
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', {
        name: /^matrix.table.headers.columns/i,
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', {
        name: /^matrix.table.headers.createdAt/i,
      })
    ).toBeInTheDocument();

    expect(
      within(table).getByRole('columnheader', {
        name: /^matrix.table.headers.actions/i,
      })
    ).toBeInTheDocument();

    const keys = ['name', 'rows', 'columns', 'createdAt'];
    mockedMatricesData.forEach((matrix: any) => {
      keys.forEach((key) => {
        const value = matrix[key];
        const valueCount = mockedMatricesData.filter(
          (mockedMatrix: any) => mockedMatrix[key] === value
        ).length;

        expect(
          within(table).getAllByRole('cell', {
            name:
              key === 'createdAt'
                ? `${new Date(value).toLocaleDateString()} ${new Date(
                    value
                  ).toLocaleTimeString()}`
                : value,
          }).length
        ).toBeGreaterThanOrEqual(valueCount);
      });
    });

    expect(screen.getAllByTestId('MoreVertIcon').length).toBe(
      matricesData.length
    );
  });

  it('actions button opens actions menu, which contains edit, delete and view action buttons', async () => {
    mockedMatricesData = matricesData;

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(0));

    const actionsMenu = screen.getByRole('menu');
    expect(actionsMenu).toBeInTheDocument();

    expect(getEditAction()).toBeInTheDocument();
    expect(getDeleteAction()).toBeInTheDocument();
    expect(getViewAction()).toBeInTheDocument();
  });

  it('submits correct create values', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockResolvedValueOnce({
      id: mockedMatricesData.length + 1,
      exampleData,
      createdAt: 444,
    });

    render(<MatrixHomepage />);

    await userEvent.click(getAddButton());
    await fillUpForm(exampleData);
    await userEvent.click(getDialogAddButton()!);

    await waitFor(() => {
      expect(mockedCreateMatrix).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert and closes dialog in case of a successful create matrix request', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockResolvedValueOnce({
      id: mockedMatricesData.length + 1,
      exampleData,
      createdAt: 444,
    });

    render(<MatrixHomepage />);

    await userEvent.click(getAddButton());
    await fillUpForm(exampleData);
    await userEvent.click(getDialogAddButton()!);

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'matrix.notifications.created'
      );
    });
  });

  it('calls an error alert and dialog  remain intact, in case the create matrix request fails with a status code other than 400', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixHomepage />);

    await userEvent.click(getAddButton());
    await fillUpForm(exampleData);
    await userEvent.click(getDialogAddButton()!);

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(exampleData.name);

    const inputs = getValuesInputs();
    const flattedValues = exampleData.values.flat();
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(flattedValues[i]);
    }
  });

  it('displays server validations errors and dialog remains intact, in case create matrix request fails with status code 400', async () => {
    mockedMatricesData = matricesData;

    const nameError = 'Field is required';
    const valuesError = 'Values must be unique';

    mockedCreateMatrix.mockRejectedValueOnce({
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
              path: 'values',
              value: [
                ['1', '1'],
                ['3', '4'],
              ],
              message: valuesError,
              location: 'body',
            },
          ],
        },
      },
    });

    render(<MatrixHomepage />);

    await userEvent.click(getAddButton());
    await fillUpForm(exampleData);
    await userEvent.click(getDialogAddButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(exampleData.name);

    const inputs = getValuesInputs();
    const flattedValues = exampleData.values.flat();
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(flattedValues[i]);
    }
  });

  it('submits correct edit matrix values', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getEditAction());
    await userEvent.click(getDialogEditButton()!);

    await waitFor(() => {
      expect(mockedUpdateMatrix).toBeCalledWith({
        ...matricesData[matrixIdx],
        createdAt: undefined,
      });
    });
  });

  it('calls a success alert and closes dialog in case of a successful update matrix request', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    mockedUpdateMatrix.mockResolvedValueOnce({
      id: mockedMatricesData.length + 1,
      exampleData,
      createdAt: 444,
    });

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getEditAction());
    await userEvent.click(getDialogEditButton()!);

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'matrix.notifications.updated'
      );
    });
  });

  it('calls an error alert and dialog remians intact, in case the update matrix request fails with a status code other than 400', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    mockedUpdateMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getEditAction());
    await userEvent.click(getDialogEditButton()!);

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(mockedMatricesData[matrixIdx].name);

    const inputs = getValuesInputs();
    const flattedValues = mockedMatricesData[matrixIdx].values.flat();
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(flattedValues[i]);
    }
  });

  it('displays server validations errors and dialog remains intact, in case update matrix request fails with status code 400', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    const nameError = 'Field is required';
    const valuesError = 'Values must be unique';

    mockedUpdateMatrix.mockRejectedValueOnce({
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
              path: 'values',
              value: [
                ['1', '1'],
                ['3', '4'],
              ],
              message: valuesError,
              location: 'body',
            },
          ],
        },
      },
    });

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getEditAction());
    await userEvent.click(getDialogEditButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(mockedMatricesData[matrixIdx].name);

    const inputs = getValuesInputs();
    const flattedValues = mockedMatricesData[matrixIdx].values.flat();
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(flattedValues[i]);
    }
  });

  it('submits correct delete matrix id', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    mockedDeleteMatrix.mockResolvedValueOnce(mockedMatricesData[matrixIdx]);

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getDeleteAction());
    await userEvent.click(getConfirmButton());

    await waitFor(() => {
      expect(mockedDeleteMatrix).toBeCalledWith(matricesData[matrixIdx].id);
    });
  });

  it('calls a success alert and closes confirmation dialog, in case of a successful delete matrix request', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    mockedDeleteMatrix.mockResolvedValueOnce(mockedMatricesData[matrixIdx]);

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getDeleteAction());
    await userEvent.click(getConfirmButton());

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockedSnackbarSuccess).toBeCalledWith(
      'matrix.notifications.deleted'
    );
  });

  it('calls an error alert and closes confirmation dialog, in case the delete matrix request fails', async () => {
    mockedMatricesData = matricesData;
    const matrixIdx = 0;

    mockedDeleteMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixHomepage />);

    await userEvent.click(getActionsButton(matrixIdx));
    await userEvent.click(getDeleteAction());
    await userEvent.click(getConfirmButton());

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );
  });
});
