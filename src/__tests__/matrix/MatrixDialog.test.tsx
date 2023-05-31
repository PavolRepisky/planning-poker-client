import userEvent from '@testing-library/user-event';
import config from 'core/config/config';
import ServerValidationError from 'core/types/ServerValidationError';
import {
  exampleData,
  fillUpForm,
  getAddButton,
  getAddColumnButton,
  getAddRowButton,
  getCancelButton,
  getEditButton,
  getNameInput,
  getRemoveColumnButton,
  getRemoveRowButton,
  getValuesInputs,
} from 'helpers/matrix/MatrixDialog.helper';
import MatrixDialog from 'matrix/components/MatrixDialog';
import { render, screen, waitFor } from 'test-utils';

const matrixData = {
  id: 1,
  name: 'Mocked Matrix',
  rows: 2,
  columns: 2,
  values: [
    ['1', '2'],
    ['3', '4'],
  ],
  createdAt: 1685389767079,
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

const initialRowsCount = 2;
const initialColumnsCount = 2;

describe('Matrix dialog', () => {
  it('is in the document, when props argument open is truthy', () => {
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

  it('is not in the document, when props argument open is falsy', () => {
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

  it('contains an add form title, if no matrix is provided', async () => {
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

  it('contains an edit form title, if a matrix is provided', async () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={matrixData}
      />
    );

    expect(screen.getByText('matrix.dialog.edit.title')).toBeInTheDocument();
  });

  it('contains a form without values and create button, if no matrix is provided', () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
      />
    );

    expect(getNameInput()).toBeInTheDocument();
    expect(getNameInput()).toHaveValue('');

    expect(screen.getByText(/^matrix.form.values.label/)).toBeInTheDocument();

    expect(getValuesInputs().length).toBe(
      initialRowsCount * initialColumnsCount
    );

    getValuesInputs().forEach((input) => {
      expect(input).toHaveValue('');
    });

    expect(getAddRowButton()).toBeInTheDocument();
    expect(getRemoveRowButton()).toBeInTheDocument();

    expect(getAddColumnButton()).toBeInTheDocument();
    expect(getRemoveColumnButton()).toBeInTheDocument();

    expect(getAddButton()).toBeInTheDocument();
    expect(getEditButton()).not.toBeInTheDocument();
  });

  it('contains a form with values and edit button, if a matrix is provided', () => {
    render(
      <MatrixDialog
        open={true}
        onUpdate={(data: any) => Promise.resolve([])}
        onCreate={(data: any) => Promise.resolve([])}
        onClose={() => {}}
        processing={false}
        matrix={matrixData}
      />
    );

    expect(getNameInput()).toBeInTheDocument();
    expect(getNameInput()).toHaveValue(matrixData.name);

    expect(screen.getByText(/^matrix.form.values.label/)).toBeInTheDocument();

    expect(getValuesInputs().length).toBe(
      initialRowsCount * initialColumnsCount
    );

    const flattedValues = matrixData.values.flat();
    getValuesInputs().forEach((input, i) => {
      expect(input).toHaveValue(flattedValues[i]);
    });

    expect(getAddRowButton()).toBeInTheDocument();
    expect(getRemoveRowButton()).toBeInTheDocument();

    expect(getAddColumnButton()).toBeInTheDocument();
    expect(getRemoveColumnButton()).toBeInTheDocument();

    expect(getEditButton()).toBeInTheDocument();
    expect(getAddButton()).not.toBeInTheDocument();
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
      expect(getNameInput()).toHaveValue(exampleData.name);
    });

    const inputs = getValuesInputs();
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

    await userEvent.dblClick(getAddColumnButton());
    await waitFor(() => {
      expect(getValuesInputs().length).toBe(
        initialRowsCount * (initialColumnsCount + 2)
      );
    });

    await userEvent.tripleClick(getRemoveColumnButton());
    await waitFor(() => {
      expect(getValuesInputs().length).toBe(
        initialRowsCount * (initialColumnsCount - 1)
      );
    });

    getValuesInputs().forEach((input) => {
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

    await userEvent.dblClick(getAddRowButton());
    await waitFor(() => {
      expect(getValuesInputs().length).toBe(
        (initialRowsCount + 2) * initialColumnsCount
      );
    });

    await userEvent.tripleClick(getRemoveRowButton());
    await waitFor(() => {
      expect(getValuesInputs().length).toBe(
        initialRowsCount * (initialColumnsCount - 1)
      );
    });

    getValuesInputs().forEach((input) => {
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
        ['1', '2'],
        ['3', '  '],
      ],
    });

    await userEvent.click(getAddButton()!);

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

    await userEvent.click(getAddButton()!);

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 15000);

  it('validates each values is unique', async () => {
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
      values: [
        ['1', '2'],
        ['2', '3'],
      ],
    });
    await userEvent.click(getAddButton()!);

    await waitFor(() => {
      expect(
        screen.getByText('common.validations.matrix.uniqueValues')
      ).toBeInTheDocument();
    });
  });

  it('contains a cancel button, whixh calls the onClose function from props', async () => {
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

    await userEvent.click(getCancelButton());
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
    await userEvent.click(getAddButton()!);

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
        matrix={matrixData}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(getEditButton()!);

    expect(mockedOnUpdate).toBeCalledWith({
      id: matrixData.id,
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
    await userEvent.click(getAddButton()!);

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
        matrix={matrixData}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(getEditButton()!);

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
    expect(screen.getByText(valuesError)).toBeInTheDocument();
  });
});
