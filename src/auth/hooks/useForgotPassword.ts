import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

const forgotPassword = async ({ email }: { email: string }): Promise<void> => {
  await axios.post('/forgot-password', { email });
};

export function useForgotPassword() {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(forgotPassword);
  return { isSending: isLoading, forgotPassword: mutateAsync };
}
