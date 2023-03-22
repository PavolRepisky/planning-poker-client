import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const updatePassword = async ({
  password,
  newPassword,
  confirmationPassword,
  authToken,
}: {
  password: string;
  newPassword: string;
  confirmationPassword: string;
  authToken: string;
}): Promise<void> => {
  await axios.patch(
    '/users/password',
    {
      password,
      newPassword,
      confirmationPassword,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
};

export function useUpdatePassword() {
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
