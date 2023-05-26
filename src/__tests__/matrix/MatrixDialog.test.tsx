import userEvent from '@testing-library/user-event';
import config from 'core/config/config';
import ServerValidationError from 'core/types/ServerValidationError';
import {
  addButton,
  addColumnButton,
  addRowButton,
  cancelButton,
  editButton,
  exampleData,
  fillUpForm,
  nameInput,
  removeColumnButton,
  removeRowButton,
  valuesInputs,
} from 'helpers/matrix/MatrixDialog.helper';
import MatrixDialog from 'matrix/components/MatrixDialog';
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

const initialRowsCount = 2;
const initialColumnsCount = 2;

describe('Matrix dialog', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(
      <MatrixDialog
        open={false}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders add form title, if no matrix is provided', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    expect(screen.getByText('matrix.dialog.add.title')).toBeInTheDocument();
  });

  it('renders edit form title, if a matrix is provided', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={mockedMatrixData}
      />
    );

    expect(screen.getByText('matrix.dialog.edit.title')).toBeInTheDocument();
  });

  it('renders form correctly without values, if no matrix is provided', () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    expect(nameInput()).toBeInTheDocument();
    expect(nameInput()).toHaveValue('');

    expect(screen.getByText(/^matrix.form.values.label/)).toBeInTheDocument();

    expect(valuesInputs().length).toBe(initialRowsCount * initialColumnsCount);

    valuesInputs().forEach((input) => {
      expect(input).toHaveValue('');
    });

    expect(addRowButton()).toBeInTheDocument();
    expect(removeRowButton()).toBeInTheDocument();

    expect(addColumnButton()).toBeInTheDocument();
    expect(removeColumnButton()).toBeInTheDocument();

    expect(cancelButton()).toBeInTheDocument();
    expect(addButton()).toBeInTheDocument();
    expect(editButton()).not.toBeInTheDocument();
  });

  it('renders form correctly with values, if a matrix is provided', () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={mockedMatrixData}
      />
    );

    expect(nameInput()).toBeInTheDocument();
    expect(nameInput()).toHaveValue(mockedMatrixData.name);

    expect(screen.getByText(/^matrix.form.values.label/)).toBeInTheDocument();

    expect(valuesInputs().length).toBe(initialRowsCount * initialColumnsCount);

    valuesInputs().forEach((input, i) => {
      expect(input).toHaveValue(mockedMatrixData.values.flat()[i]);
    });

    expect(addRowButton()).toBeInTheDocument();
    expect(removeRowButton()).toBeInTheDocument();

    expect(addColumnButton()).toBeInTheDocument();
    expect(removeColumnButton()).toBeInTheDocument();

    expect(cancelButton()).toBeInTheDocument();
    expect(addButton()).not.toBeInTheDocument();
    expect(editButton()).toBeInTheDocument();
  });

  it('handles inputs changes', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    await fillUpForm(exampleData);

    await waitFor(() => {
      expect(nameInput()).toHaveValue(exampleData.name);
    });

    const inputs = valuesInputs();
    const flattedValues = exampleData.values.flat();

    for (let i = 0; i < inputs.length; i++) {
      expect(inputs[i]).toHaveValue(`${flattedValues[i]}`);
    }
  });

  it('handles add and remove columns', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    await userEvent.dblClick(addColumnButton());

    expect(valuesInputs().length).toBe(
      initialRowsCount * (initialColumnsCount + 2)
    );

    await userEvent.tripleClick(removeColumnButton());

    expect(valuesInputs().length).toBe(
      initialRowsCount * (initialColumnsCount - 1)
    );

    valuesInputs().forEach((input) => {
      expect(input).toHaveValue('');
    });
  });

  it('handles add and remove rows', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    await userEvent.dblClick(addRowButton());

    expect(valuesInputs().length).toBe(
      (initialRowsCount + 2) * initialColumnsCount
    );

    await userEvent.tripleClick(removeRowButton());

    expect(valuesInputs().length).toBe(
      initialRowsCount * (initialColumnsCount - 1)
    );

    valuesInputs().forEach((input) => {
      expect(input).toHaveValue('');
    });
  });

  it('validates, that all inputs are filled and trims them', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    await fillUpForm({
      name: '  ',
      values: [
        [' ', '   '],
        [' ', '  '],
      ],
    });

    await userEvent.click(addButton()!);

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('validates inputs max length', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    await fillUpForm({
      name: 'n'.repeat(config.maxNameLength + 1),
      values: [
        ['1', '2'],
        ['3', '4'.repeat(config.maxNameLength + 1)],
      ],
    });

    await userEvent.click(addButton()!);

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 20000);

  it('calls onClose from props, when cancel button is clicked', async () => {
    const mockedOnClose = jest.fn();

    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={mockedOnClose}
        processing={false}
      />
    );

    await userEvent.click(cancelButton());
    expect(mockedOnClose).toBeCalledTimes(1);
  });

  it('calls onCreate from props with correct values, when add button is clicked and matrix is not present', async () => {
    const mockedOnCreate = jest.fn();

    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={mockedOnCreate}
        onClose={() => {}}
        processing={false}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(addButton()!);

    expect(mockedOnCreate).toBeCalledWith(exampleData);
  });

  it('calls onUpdate from props with correct values, when edit button is clicked and matrix is present', async () => {
    const mockedOnUpdate = jest.fn();

    render(
      <MatrixDialog
        open={true}
        onUpdate={mockedOnUpdate}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={mockedMatrixData}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(editButton()!);

    expect(mockedOnUpdate).toBeCalledWith({
      id: mockedMatrixData.id,
      ...exampleData,
    });
  });

  it('displays server validations errors received from onCreate function from props', async () => {
    const nameError = 'Field is required';
    const valuesError = 'Values must be unique';

    const serverErrors: ServerValidationError[] = [
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
    ];

    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve(serverErrors)}
        onClose={() => {}}
        processing={false}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(addButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();
  });

  it('displays server validations errors received from onUpdate function from props', async () => {
    const nameError = 'Value is too long';
    const valuesError = 'Values must be non empty';

    const serverErrors: ServerValidationError[] = [
      {
        path: 'name',
        value: 'tooLongName',
        message: nameError,
        location: 'body',
      },
      {
        path: 'values',
        value: [
          ['1', '2'],
          ['3', ' '],
        ],
        message: valuesError,
        location: 'body',
      },
    ];

    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve(serverErrors)}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={mockedMatrixData}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(editButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();
  });
});
