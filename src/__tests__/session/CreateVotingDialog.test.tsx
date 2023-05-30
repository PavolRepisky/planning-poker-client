import userEvent from '@testing-library/user-event';
import {
  exampleData,
  fillUpForm,
  getCancelButton,
  getDescriptionInput,
  getNameInput,
  getSubmitButton,
} from 'helpers/session/CreateVotingDialog.helper';
import CreateVotingDialog from 'session/components/CreateVotingDialog';
import { render, screen, waitFor } from 'test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

describe('Create voting dialog', () => {
  it('is in the document, when prop argument open is truthy', () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('is not in the document, when prop argument open is falsy', () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={false}
        processing={false}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('contains a create voting title', async () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    expect(
      screen.getByText('session.dialog.createVoting.title')
    ).toBeInTheDocument();
  });

  it('contains a create voting form with a submit button', async () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    expect(getNameInput()).toBeInTheDocument();
    expect(getDescriptionInput()).toBeInTheDocument();
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('contains a cancel button, which calls the onClose function from the props', async () => {
    const mockedOnClose = jest.fn();
    render(
      <CreateVotingDialog
        onClose={mockedOnClose}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    const cancelButton = getCancelButton();
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(mockedOnClose).toBeCalledTimes(1);
  });

  it('validates name input is filled and trimmes it, description is an optional input', async () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    await fillUpForm({ name: '    ', description: '   ' });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getAllByText('common.validations.required').length).toBe(1);
    });
  });

  it('handles inputs changes', async () => {
    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={(data: any) => Promise.resolve([])}
        open={true}
        processing={false}
      />
    );

    await fillUpForm(exampleData);

    await waitFor(() => {
      expect(getNameInput()).toHaveValue(exampleData.name);
    });
    expect(getDescriptionInput()).toHaveValue(exampleData.description);
  });

  it('calls onCreate function from props with correct values, on submit', async () => {
    const mockedOnCreate = jest.fn();
    mockedOnCreate.mockResolvedValueOnce([]);

    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={mockedOnCreate}
        open={true}
        processing={false}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedOnCreate).toHaveBeenCalledWith(exampleData);
    });
  });

  it('displays server validations errors returned by onCreate function from props', async () => {
    const nameError = 'Field is required';

    const mockedOnCreate = jest.fn();

    mockedOnCreate.mockResolvedValueOnce([
      {
        path: 'name',
        value: '',
        message: nameError,
        location: 'body',
      },
    ]);

    render(
      <CreateVotingDialog
        onClose={() => {}}
        onCreate={mockedOnCreate}
        open={true}
        processing={false}
      />
    );

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(nameError)).toBeInTheDocument();
    });
  });
});
