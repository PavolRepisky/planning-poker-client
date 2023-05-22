import userEvent from '@testing-library/user-event';
import ConfirmDialog from 'core/components/ConfirmDialog';
import { render, screen } from 'test-utils';

describe('Confirm dialog', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    const confirmDialog = screen.getByRole('dialog');
    expect(confirmDialog).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(
      <ConfirmDialog
        open={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    const confirmDialog = screen.queryByRole('dialog');
    expect(confirmDialog).not.toBeInTheDocument();
  });

  it('renders a title and a description from props', () => {
    const titleProp = 'Test title';
    const descriptionProp = 'Test description';

    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title={titleProp}
        description={descriptionProp}
        pending={false}
      />
    );

    const title = screen.getByRole('heading', {
      name: titleProp,
    });
    expect(title).toBeInTheDocument();

    const description = screen.getByText(descriptionProp);
    expect(description).toBeInTheDocument();
  });

  it('renders a cancel and confirm button', () => {
    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: 'common.cancel',
    });
    expect(cancelButton).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', {
      name: 'common.confirm',
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it('calls onClose function from props, when cancel button is clicked', async () => {
    const onCloseHandler = jest.fn();
    render(
      <ConfirmDialog
        open={true}
        onClose={onCloseHandler}
        onConfirm={() => {}}
        title="title"
        pending={false}
      />
    );

    const cancelButton = screen.getByRole('button', {
      name: 'common.cancel',
    });
    await userEvent.click(cancelButton);

    expect(onCloseHandler).toBeCalledTimes(1);
  });

  it('calls onConfirm function from props, when confirm button is clicked', async () => {
    const onConfirmHandler = jest.fn();
    render(
      <ConfirmDialog
        open={true}
        onClose={() => {}}
        onConfirm={onConfirmHandler}
        title="title"
        pending={false}
      />
    );

    const confirmButton = screen.getByRole('button', {
      name: 'common.confirm',
    });
    await userEvent.click(confirmButton);

    expect(onConfirmHandler).toBeCalledTimes(1);
  });
});
