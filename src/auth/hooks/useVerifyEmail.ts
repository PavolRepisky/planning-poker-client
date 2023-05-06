import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const verifyEmail = async ({
  verificationCode,
}: {
  verificationCode: string;
}): Promise<void> => {
  await axios.get(`/verify-email/${verificationCode}`);
};

export function useVerifyEmail() {
  const { isLoading, mutateAsync } = useMutation(verifyEmail);
  return { isVerifying: isLoading, verifyEmail: mutateAsync };
}