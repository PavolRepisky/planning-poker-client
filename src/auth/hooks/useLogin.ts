import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

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
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(login);
  return { isLoggingIn: isLoading, login: mutateAsync };
};
