import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const logout = async (): Promise<void> => {
  await axios.get('/logout');
};

export const useLogout = () => {
  const { isLoading, mutateAsync } = useMutation(logout);
  return { isLoggingOut: isLoading, logout: mutateAsync };
};
