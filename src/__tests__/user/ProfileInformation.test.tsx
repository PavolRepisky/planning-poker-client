import userEvent from '@testing-library/user-event';
import config from 'core/config/config';
import {
  exampleData,
  fillUpForm,
  firstNameInput,
  lastNameInput,
  resetButton,
  submitButton,
} from 'helpers/user/ProfileInformation.helper';
import { render, screen, waitFor } from 'test-utils';
import ProfileInformation from 'user/pages/ProfileInformation';

const mockedUserData = {
  id: 1,
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};
jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: mockedUserData,
  }),
}));

const mockedUpdateName = jest.fn();
jest.mock('user/hooks/useUpdateName', () => ({
  useUpdateName: () => ({
    isUpdating: false,
    updateName: mockedUpdateName,
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

describe('Profile information page', () => {
  it('renders form title correctly', async () => {
    render(<ProfileInformation />);

    expect(screen.getByText('profile.info.title')).toBeInTheDocument();
  });

  it('renders form correctly with default values', () => {
    render(<ProfileInformation />);

    expect(firstNameInput()).toBeInTheDocument();
    expect(firstNameInput()).toHaveValue(mockedUserData.firstName);

    expect(lastNameInput()).toBeInTheDocument();
    expect(lastNameInput()).toHaveValue(mockedUserData.lastName);

    expect(submitButton()).toBeInTheDocument();
    expect(resetButton()).toBeInTheDocument();
  });

  it('handles inputs changes', async () => {
    render(<ProfileInformation />);

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await userEvent.type(firstNameInput(), exampleData.firstName);
    expect(firstNameInput()).toHaveValue(exampleData.firstName);
    await userEvent.type(lastNameInput(), exampleData.lastName);
    expect(lastNameInput()).toHaveValue(exampleData.lastName);
  });

  it('validates, that all inputs are filled and trims them', async () => {
    render(<ProfileInformation />);

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await userEvent.type(firstNameInput(), ' ');
    await userEvent.type(lastNameInput(), '   ');

    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('validates inputs max length', async () => {
    render(<ProfileInformation />);

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await userEvent.type(
      firstNameInput(),
      'f'.repeat(config.maxNameLength + 1)
    );
    await userEvent.type(lastNameInput(), 'l'.repeat(config.maxNameLength + 1));

    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 10000);

  it('submits correct values', async () => {
    render(<ProfileInformation />);
    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(mockedUpdateName).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert in case of a successful update name request', async () => {
    render(<ProfileInformation />);

    mockedUpdateName.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          user: exampleData,
        },
      },
    });

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarSuccess).toBeCalledWith(
      'profile.info.notifications.success'
    );
  });

  it('calls an error alert and form values remain intact in case the update name request fails with a status code other than 400', async () => {
    render(<ProfileInformation />);

    mockedUpdateName.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    expect(mockedSnackbarError).toBeCalledWith(
      'common.errors.unexpected.subTitle'
    );

    expect(firstNameInput()).toHaveValue(exampleData.firstName);
    expect(lastNameInput()).toHaveValue(exampleData.lastName);
  });

  it('displays server validations errors in case the update name request fails with status code 400', async () => {
    render(<ProfileInformation />);

    const firstNameError = 'Field is required';
    const lastNameError = 'Value is too long';

    mockedUpdateName.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          errors: [
            {
              path: 'firstName',
              value: '',
              message: firstNameError,
              location: 'body',
            },
            {
              path: 'lastName',
              value: 'lastNameTooLong',
              message: lastNameError,
              location: 'body',
            },
          ],
        },
      },
    });

    await userEvent.clear(firstNameInput());
    await userEvent.clear(lastNameInput());

    await fillUpForm(exampleData);
    await userEvent.click(submitButton());

    await waitFor(() => {
      expect(screen.getByText(firstNameError)).toBeInTheDocument();
    });
    expect(screen.getByText(lastNameError)).toBeInTheDocument();
  });

  it('resets form to previous values, after reset button is clicked', async () => {
    render(<ProfileInformation />);

    await userEvent.type(
      firstNameInput(),
      mockedUserData.firstName + '_Updated'
    );
    await userEvent.type(lastNameInput(), mockedUserData.lastName + '_Updated');
    await userEvent.click(resetButton());

    await waitFor(() => {
      expect(firstNameInput()).toHaveValue(mockedUserData.firstName);
    });
    expect(lastNameInput()).toHaveValue(mockedUserData.lastName);
  });
});
