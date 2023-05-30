import VerifyEmail from 'auth/pages/VerifyEmail';
import * as router from 'react-router';
import { render, waitFor } from 'test-utils';

const mockedVerifyEmail = jest.fn();
jest.mock('auth/hooks/useVerifyEmail', () => ({
  useVerifyEmail: () => ({
    isVerifying: false,
    verifyEmail: mockedVerifyEmail,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
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

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Verify email page', () => {
  it('calls a success alert and redirects to the login page in case of a successful verify email request', async () => {
    mockedVerifyEmail.mockResolvedValueOnce({});

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(mockedSnackbarSuccess).toBeCalledWith(
        'auth.verifyEmail.notifications.success'
      );
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('calls an error alert and redirects to the landing page in case the verify email request fails with a status code other than 404', async () => {
    mockedVerifyEmail.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(mockedSnackbarError).toBeCalledWith(
        'common.errors.unexpected.subTitle'
      );
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('redirects to the 404 page in case the verification code is incorrect', async () => {
    mockedVerifyEmail.mockRejectedValueOnce({
      response: {
        status: 404,
      },
    });

    render(<VerifyEmail />);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/404');
    });
  });
});
