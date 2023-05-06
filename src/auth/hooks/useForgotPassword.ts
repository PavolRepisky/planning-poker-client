import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const forgotPassword = async ({ email }: { email: string }): Promise<void> => {
  await axios.post('/forgot-password', { email });
};

export function useForgotPassword() {
  const { isLoading, mutateAsync } = useMutation(forgotPassword);
  return { isSending: isLoading, forgotPassword: mutateAsync };
}
