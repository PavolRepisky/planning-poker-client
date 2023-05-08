import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

const verifyEmail = async ({
  verificationCode,
}: {
  verificationCode: string;
}): Promise<void> => {
  await axios.get(`/verify-email/${verificationCode}`);
};

export function useVerifyEmail() {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(verifyEmail);
  return { isVerifying: isLoading, verifyEmail: mutateAsync };
}
