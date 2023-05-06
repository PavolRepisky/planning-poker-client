import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

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
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
};
