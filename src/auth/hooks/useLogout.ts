import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

const logout = async (): Promise<void> => {
  await axios.get('/logout');
};

export const useLogout = () => {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(logout);
  return { isLoggingOut: isLoading, logout: mutateAsync };
};
