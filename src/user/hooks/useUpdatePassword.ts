import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

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
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(updatePassword);
  return { isUpdating: isLoading, updatePassword: mutateAsync };
}
