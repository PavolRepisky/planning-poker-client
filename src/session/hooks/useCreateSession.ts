import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';
import SessionData from 'session/types/SessionData';

const createSession = async (
  session: Partial<SessionData>
): Promise<SessionData> => {
  const { data } = await axios.post('/sessions', session);
  return data.data.session;
};

export const useCreateSession = () => {
  const { isLoading, mutateAsync } = useMutation(createSession);
  return { isCreating: isLoading, createSession: mutateAsync };
};
