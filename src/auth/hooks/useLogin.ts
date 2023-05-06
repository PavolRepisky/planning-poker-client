import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> => {
  const { data } = await axios.post('/login', { email, password });
  return data.data.accessToken;
};

export const useLogin = () => {
  const { isLoading, mutateAsync } = useMutation(login);
  return { isLoggingIn: isLoading, login: mutateAsync };
};
