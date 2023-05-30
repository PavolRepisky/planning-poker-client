import { screen, within } from 'test-utils';

export const getAlert = () => screen.getByRole('alert');

export const getAlertSuccessTitle = () =>
  within(getAlert()).getByText('common.snackbar.success');

export const getAlertErrorTitle = () =>
  within(getAlert()).getByText('common.snackbar.error');

export const getAlertDescription = (description: string) =>
  within(getAlert()).getByText(description);
