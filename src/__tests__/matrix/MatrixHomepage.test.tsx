import userEvent from '@testing-library/user-event';
import {
  addButton as addDialogButton,
  exampleData,
  fillUpForm,
  nameInput,
  valuesInputs,
} from 'helpers/matrix/MatrixDialog.helper';
import MatrixHomepage from 'matrix/pages/MatrixHomepage';
import * as router from 'react-router';
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

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

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

describe('Matrix homepage', () => {
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

  it('renders a toolbar correctly', () => {
    render(<MatrixHomepage />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();

    expect(
      within(toolbar).getByRole('heading', {
        name: 'matrix.toolbar.title',
      })
    ).toBeInTheDocument();

    expect(
      within(toolbar).getByRole('button', {
        name: 'matrix.dialog.add.action',
      })
    ).toBeInTheDocument();
  });

  it('add button opens create matrix dialog', async () => {
    render(<MatrixHomepage />);

    const toolbar = screen.getByRole('toolbar');
    const addButton = within(toolbar).getByRole('button', {
      name: 'matrix.dialog.add.action',
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
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

  it('submits correct values', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          matrix: {
            id: mockedMatricesData.length + 1,
            exampleData,
            createdAt: 444,
          },
        },
      },
    });

    render(<MatrixHomepage />);

    const addButton = screen.getByRole('button', {
      name: 'matrix.dialog.add.action',
    });
    await userEvent.click(addButton);

    await fillUpForm(exampleData);
    await userEvent.click(addDialogButton()!);

    await waitFor(() => {
      expect(mockedCreateMatrix).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert and closes dialog in case of a successful create matrix request', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          matrix: {
            id: mockedMatricesData.length + 1,
            exampleData,
            createdAt: 444,
          },
        },
      },
    });

    render(<MatrixHomepage />);

    const addButton = screen.getByRole('button', {
      name: 'matrix.dialog.add.action',
    });
    await userEvent.click(addButton);

    await fillUpForm(exampleData);
    await userEvent.click(addDialogButton()!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(mockedSnackbarSuccess).toBeCalledWith(
      'matrix.notifications.created'
    );
  });

  it('calls an error alert and form values remain intact in case the create matrix request fails with a status code other than 400', async () => {
    mockedMatricesData = matricesData;

    mockedCreateMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixHomepage />);

    const addButton = screen.getByRole('button', {
      name: 'matrix.dialog.add.action',
    });
    await userEvent.click(addButton);

    await fillUpForm(exampleData);
    await userEvent.click(addDialogButton()!);

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(nameInput()).toHaveValue(exampleData.name);

    const flattedValues = exampleData.values.flat();
    const inputs = valuesInputs();
    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(flattedValues[i]);
    }
  });
});
