import userEvent from '@testing-library/user-event';
import { screen } from 'test-utils';

export const nameInput = () =>
  screen.getByRole('textbox', {
    name: 'matrix.form.name.label',
  });

export const valuesInputs = () =>
  screen
    .queryAllByRole('textbox')
    .filter((input) => input.getAttribute('name') !== 'name');

export const addRowButton = () => screen.getByTestId('add-row-button');
export const removeRowButton = () => screen.getByTestId('remove-row-button');

export const addColumnButton = () => screen.getByTestId('add-column-button');
export const removeColumnButton = () =>
  screen.getByTestId('remove-column-button');

export const cancelButton = () =>
  screen.getByRole('button', {
    name: 'common.cancel',
  });

export const editButton = () =>
  screen.queryByRole('button', {
    name: 'matrix.dialog.edit.action',
  });

export const addButton = () =>
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
  name: string;
  values: string[][];
}) => {
  await userEvent.clear(nameInput());
  await userEvent.type(nameInput(), data.name);

  const inputs = valuesInputs();
  const flattedValues = data.values.flat();

  for (let i = 0; i < inputs.length; i++) {
    await userEvent.clear(inputs[i]);
    await userEvent.type(inputs[i], flattedValues[i]);
  }
};
