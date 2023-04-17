import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';
import SessionData from 'session/types/SessionData';

const createSession = async ({
  session,
  authToken,
}: {
  session: Partial<SessionData>;
  authToken: string;
}): Promise<SessionData> => {
  const { data } = await axios.post('/sessions', session, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data.session;
};

export const useCreateSession = () => {
  const { isLoading, mutateAsync } = useMutation(createSession);
  return { isCreating: isLoading, createSession: mutateAsync };
};
