import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

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
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(resetPassword);
  return { isResetting: isLoading, resetPassword: mutateAsync };
}
