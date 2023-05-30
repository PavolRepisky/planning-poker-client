import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const getNameInput = () =>
  screen.getByRole('textbox', {
    name: 'matrix.form.name.label',
  });

export const getValuesInputs = () =>
  screen
    .queryAllByRole('textbox')
    .filter((input) => input.getAttribute('name') !== 'name');

export const getAddRowButton = () => screen.getByTestId('add-row-button');
export const getRemoveRowButton = () => screen.getByTestId('remove-row-button');

export const getAddColumnButton = () => screen.getByTestId('add-column-button');
export const getRemoveColumnButton = () =>
  screen.getByTestId('remove-column-button');

export const getCancelButton = () =>
  screen.getByRole('button', {
    name: 'common.cancel',
  });

export const getEditButton = () =>
  screen.queryByRole('button', {
    name: 'matrix.dialog.edit.action',
  });

export const getAddButton = () =>
  screen.queryByRole('button', {
    name: 'matrix.dialog.add.action',
  });

export const exampleData = {
  name: 'Matrix',
  rows: 2,
  columns: 2,
  values: [
    ['1', '2'],
    ['3', '4'],
  ],
};

export const fillUpForm = async (data: {
  name?: string;
  values?: string[][];
}) => {
  const nameInput = getNameInput();
  const valuesInputs = getValuesInputs();

  await userEvent.clear(nameInput);
  for (let i = 0; i < valuesInputs.length; i++) {
    await userEvent.clear(valuesInputs[i]);
  }

  if (data.name) await userEvent.type(nameInput, data.name);
  if (data.values) {
    const flattedValues = data.values.flat();
    for (let i = 0; i < valuesInputs.length && i < flattedValues.length; i++) {
      await userEvent.type(valuesInputs[i], flattedValues[i]);
    }
  }
};
