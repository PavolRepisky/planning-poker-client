import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const updatePassword = async ({
  password,
  newPassword,
  confirmationPassword,
}: {
  password: string;
  newPassword: string;
  confirmationPassword: string;
}): Promise<void> => {
  await axios.patch('/users/password', {
    password,
    newPassword,
    confirmationPassword,
  });
};

export function useUpdatePassword() {
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
