import { useMutation } from '@tanstack/react-query';
import LoginSuccessResponse from 'auth/types/loginSuccessResponse';
import axios from 'core/config/axios';

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<LoginSuccessResponse> => {
  const { data } = await axios.post('/users/login', { email, password });
  return data;
};

export function useLogin() {
  const { isLoading, mutateAsync } = useMutation(login);
  return { isLoggingIn: isLoading, login: mutateAsync };
}
