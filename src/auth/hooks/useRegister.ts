import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';

// TODO: change function return type to created user
const register = async ({
  firstName,
  lastName,
  email,
  password,
  confirmationPassword,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmationPassword: string;
}): Promise<{ message: string }> => {
  const { data } = await axios.post('/register', {
    firstName,
    lastName,
    email,
    password,
    confirmationPassword,
  });
  return data;
};

export const useRegister = () => {
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
};
