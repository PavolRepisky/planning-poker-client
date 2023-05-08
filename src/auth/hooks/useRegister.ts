import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';

let axios: AxiosInstance;

const register = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmationPassword: string;
}): Promise<string> => {
  const { data } = await axios.post('/register', userData);
  return data.data.userId;
};

export const useRegister = () => {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
};
