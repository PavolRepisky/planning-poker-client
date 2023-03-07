import { useMutation } from '@tanstack/react-query';
import RegisterSuccessResponse from 'auth/types/registerSuccessResponse';
import axios from 'core/config/axios';

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
}): Promise<RegisterSuccessResponse> => {
  const { data } = await axios.post('/users/register', {
    firstName,
    lastName,
    email,
    password,
    confirmationPassword,
  });
  return data;
};

export function useRegister() {
  const { isLoading, mutateAsync } = useMutation(register);
  return { isRegistering: isLoading, register: mutateAsync };
}
