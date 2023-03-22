import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';
import Session from 'session/types/Session';

const createSession = async ({
  session,
  authToken,
}: {
  session: Partial<Session>;
  authToken: string;
}): Promise<Session> => {
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
