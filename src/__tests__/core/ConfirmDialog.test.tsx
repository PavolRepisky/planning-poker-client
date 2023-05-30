import userEvent from '@testing-library/user-event';
import ConfirmDialog from 'core/components/ConfirmDialog';
import {
  getCancelButton,
  getConfirmButton,
} from 'helpers/core/ConfirmDialog.helper';
import { render, screen, waitFor, within } from 'test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

describe('Confirm dialog', () => {
  it('is in the document, when props argument open is truthy', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is not in the document, when props argument open is falsy', () => {
    render(
      <ConfirmDialog
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('contains a title and a description from props', () => {
    const title = 'Test title';
    const description = 'Test description';

    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title={title}
        description={description}
        pending={false}
      />
    );

    expect(
      within(screen.getByRole('dialog')).getByRole('heading', {
        name: title,
      })
    ).toBeInTheDocument();

    expect(
      within(screen.getByRole('dialog')).getByText(description)
    ).toBeInTheDocument();
  });

  it('contains a confirm button, which calls the onConfirm function from props', async () => {
    const mockedOnConfirm = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={mockedOnConfirm}
        title="title"
        pending={false}
      />
    );

    const confirmButton = getConfirmButton();
    expect(confirmButton).toBeInTheDocument();

    await userEvent.click(confirmButton);
    expect(mockedOnConfirm).toBeCalledTimes(1);
  });

  it('contains a cancel button, which calls the onClose function from props', async () => {
    const mockedOnClose = jest.fn();

    render(
      <ConfirmDialog
        open={true}
        onClose={mockedOnClose}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    const cancelButton = getCancelButton();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    await waitFor(() => {
      expect(mockedOnClose).toBeCalledTimes(1);
    });
  });
});
