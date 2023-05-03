import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const logout = async ({ authToken }: { authToken: string }): Promise<void> => {
  await axios.get('/logout', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const useLogout = () => {
  const { isLoading, mutateAsync } = useMutation(logout);
  return { isLoggingOut: isLoading, logout: mutateAsync };
};
