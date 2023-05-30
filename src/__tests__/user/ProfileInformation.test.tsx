import userEvent from '@testing-library/user-event';
import config from 'core/config/config';
import {
  exampleData,
  fillUpForm,
  getFirstNameInput,
  getLastNameInput,
  getResetButton,
  getSubmitButton,
} from 'helpers/user/ProfileInformation.helper';
import { render, screen, waitFor } from 'test-utils';
import ProfileInformation from 'user/pages/ProfileInformation';

const userData = {
  id: 'mocked-user-id',
  firstName: 'Joe',
  lastName: 'Doe',
  email: 'joe@doe.com',
};

jest.mock('auth/contexts/AuthProvider', () => ({
  useAuth: () => ({
    userData: userData,
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
  }),
}));

describe('Profile information page', () => {
  it('contains a profile information title', async () => {
    render(<ProfileInformation />);

    expect(screen.getByText('profile.info.title')).toBeInTheDocument();
  });

  it('contains a profile information form, with default values and submit button', () => {
    render(<ProfileInformation />);

    const firstNameInput = getFirstNameInput();
    const lastNameInput = getLastNameInput();

    expect(firstNameInput).toBeInTheDocument();
    expect(firstNameInput).toHaveValue(userData.firstName);

    expect(lastNameInput).toBeInTheDocument();
    expect(lastNameInput).toHaveValue(userData.lastName);

    expect(getSubmitButton()).toBeInTheDocument();
  });

  it('handles inputs changes', async () => {
    render(<ProfileInformation />);

    await fillUpForm(exampleData);

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
  });

  it('validates, that all inputs are filled and trims them', async () => {
    render(<ProfileInformation />);

    await fillUpForm({
      firstName: '  ',
      lastName: '   ',
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.queryAllByText('common.validations.required').length).toBe(
        2
      );
    });
  });

  it('validates inputs max length', async () => {
    render(<ProfileInformation />);

    await fillUpForm({
      firstName: 'f'.repeat(config.maxNameLength + 1),
      lastName: 'l'.repeat(config.maxNameLength + 1),
    });
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(
        screen.queryAllByText('common.validations.string.max').length
      ).toBe(2);
    });
  }, 10000);

  it('submits correct values', async () => {
    render(<ProfileInformation />);

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedUpdateName).toHaveBeenCalledWith(exampleData);
    });
  });

  it('calls a success alert in case of a successful update name request', async () => {
    render(<ProfileInformation />);

    mockedUpdateName.mockResolvedValueOnce(userData);

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'profile.info.notifications.success'
      );
    });
  });

  it('calls an error alert and form values remain intact, in case the update name request fails with a status code other than 400', async () => {
    render(<ProfileInformation />);

    mockedUpdateName.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
  });

  it('displays server validations errors and form values remain intact, in case the update name request fails with status code 400', async () => {
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

    await fillUpForm(exampleData);
    await userEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(screen.getByText(firstNameError)).toBeInTheDocument();
    });
    expect(screen.getByText(lastNameError)).toBeInTheDocument();

    expect(getFirstNameInput()).toHaveValue(exampleData.firstName);
    expect(getLastNameInput()).toHaveValue(exampleData.lastName);
  });

  it('contains a reset button, which resets form to previous values', async () => {
    render(<ProfileInformation />);

    await fillUpForm({
      firstName: userData.firstName + '_Changed',
      lastName: userData.lastName + '_Changed',
    });
    await userEvent.click(getResetButton());

    await waitFor(() => {
      expect(getFirstNameInput()).toHaveValue(userData.firstName);
    });
    expect(getLastNameInput()).toHaveValue(userData.lastName);
  });
});
