import userEvent from '@testing-library/user-event';
import { editButton as dialogEditButton } from 'helpers/matrix/MatrixDialog.helper';
import MatrixDetail from 'matrix/pages/MatrixDetail';
import * as router from 'react-router';
import { render, screen, waitFor, within } from 'test-utils';

const matrixData = {
  id: 1,
  name: 'Mocked Matrix',
  rows: 2,
  columns: 2,
  values: [['1', '2'], ['3, 4']],
  createdAt: 123,
};

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

let mockedMatrixData: any = matrixData;
jest.mock('matrix/hooks/useGetMatrix', () => ({
  useGetMatrix: () => ({
    data: mockedMatrixData,
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

describe('Matrix detail page', () => {
  it('redirects to not found page, in case of no matrix data', () => {
    mockedMatrixData = undefined;

    render(<MatrixDetail />);

    expect(mockedNavigate).toHaveBeenCalledWith('/404');
  });

  it('renders a toolbar correctly', () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    const toolbar = screen.getByRole('toolbar');
    expect(toolbar).toBeInTheDocument();

    expect(
      within(toolbar).getByRole('heading', {
        name: mockedMatrixData.name,
      })
    ).toBeInTheDocument();
  });

  it('renders edit button correctly', async () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    const editButton = screen.getByRole('button', {
      name: 'common.edit',
    });
    expect(editButton).toBeInTheDocument();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(editButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders delete button correctly', async () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    const deleteButton = screen.getByRole('button', {
      name: 'common.delete',
    });
    expect(deleteButton).toBeInTheDocument();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders vote cards correctly', async () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    matrixData.values.forEach((row) => {
      row.forEach((value) => {
        expect(
          screen.getByRole('button', {
            name: value,
          })
        ).toBeInTheDocument();
      });
    });
  });

  it('submits correct edit values', async () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    const editButton = screen.getByRole('button', {
      name: 'common.edit',
    });
    await userEvent.click(editButton);
    await userEvent.click(dialogEditButton()!);

    await waitFor(() => {
      expect(mockedUpdateMatrix).toBeCalledWith({
        ...matrixData,
        createdAt: undefined,
      });
    });
  });

  it('submits correct delete id', async () => {
    mockedMatrixData = matrixData;

    render(<MatrixDetail />);

    const deleteButton = screen.getByRole('button', {
      name: 'common.delete',
    });
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', {
      name: 'common.confirm',
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockedDeleteMatrix).toBeCalledWith(matrixData.id);
    });
  });

  it('calls a success alert and closes dialog in case of a successful update matrix request', async () => {
    mockedMatrixData = matrixData;

    mockedUpdateMatrix.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          matrix: matrixData,
        },
      },
    });

    render(<MatrixDetail />);

    const editButton = screen.getByRole('button', {
      name: 'common.edit',
    });
    await userEvent.click(editButton);

    await userEvent.click(dialogEditButton()!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(mockedSnackbarSuccess).toBeCalledWith(
      'matrix.notifications.updated'
    );
  });

  it('calls an error alert and keeps dialog open in case update matrix request failed with status code other than 400', async () => {
    mockedMatrixData = matrixData;

    mockedUpdateMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixDetail />);

    const editButton = screen.getByRole('button', {
      name: 'common.edit',
    });
    await userEvent.click(editButton);
    await userEvent.click(dialogEditButton()!);

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays server validations errors in case of a failed update matrix request', async () => {
    mockedMatrixData = matrixData;

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

    render(<MatrixDetail />);

    const editButton = screen.getByRole('button', {
      name: 'common.edit',
    });
    await userEvent.click(editButton);
    await userEvent.click(dialogEditButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls a success alert and redirects to matrix homepage, in case of a successful delete matrix request', async () => {
    mockedMatrixData = matrixData;

    mockedDeleteMatrix.mockResolvedValueOnce({
      status: 200,
    });

    render(<MatrixDetail />);

    const deleteButton = screen.getByRole('button', {
      name: 'common.delete',
    });
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', {
      name: 'common.confirm',
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'matrix.notifications.deleted'
      );
    });

    expect(mockedNavigate).toBeCalledWith('/matrices');
  });

  it('calls an error alert and closes confirmation dialog, in case of a failed delete matrix request', async () => {
    mockedMatrixData = matrixData;

    mockedDeleteMatrix.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<MatrixDetail />);

    const deleteButton = screen.getByRole('button', {
      name: 'common.delete',
    });
    await userEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', {
      name: 'common.confirm',
    });
    await userEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );
  });
});
