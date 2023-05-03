import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const resetPassword = async ({
  password,
  confirmationPassword,
  resetToken,
}: {
  password: string;
  confirmationPassword: string;
  resetToken: string;
}): Promise<void> => {
  await axios.patch(`/reset-password/${resetToken}`, {
    password,
    confirmationPassword,
  });
};

export function useResetPassword() {
  const { isLoading, mutateAsync } = useMutation(resetPassword);
  return { isResetting: isLoading, resetPassword: mutateAsync };
}
