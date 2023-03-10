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
}) => {
  const { data } = await axios.patch(
    '/user/password',
    {
      password,
      newPassword,
      confirmationPassword,
    },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return data;
};

export function useUpdatePassword() {
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
