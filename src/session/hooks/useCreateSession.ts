import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import SessionData from 'session/types/SessionData';

let axios: AxiosInstance;

const createSession = async (
  session: Partial<SessionData>
): Promise<SessionData> => {
  const { data } = await axios.post('/sessions', session);
  return data.data.session;
};

export const useCreateSession = () => {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(createSession);
  return { isCreating: isLoading, createSession: mutateAsync };
};
