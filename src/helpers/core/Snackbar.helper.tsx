import { screen, waitFor, within } from 'test-utils';

export const expectToDisplaySuccessAlert = async (message: string) => {
  let alert;
  await waitFor(() => {
    alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  if (alert) {
    expect(
      within(alert).getByText('common.snackbar.success')
    ).toBeInTheDocument();

    expect(within(alert).getByText(message)).toBeInTheDocument();
  }
};

export const expectToDisplayGeneralErrorAlert = async () => {
  let alert;

  await waitFor(() => {
    alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  if (alert) {
    expect(
      within(alert).getByText('common.snackbar.error')
    ).toBeInTheDocument();

    expect(
      within(alert).getByText('common.errors.unexpected.subTitle')
    ).toBeInTheDocument();
  }
};
