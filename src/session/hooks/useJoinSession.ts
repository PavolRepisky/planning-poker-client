import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import Session from 'session/types/Session';

const joinSession = async ({
  hashId,
  authToken,
}: {
  hashId: string;
  authToken?: string;
}): Promise<Session> => {
  const { data } = await axios.get(`/sessions/${hashId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data.session;
};

export const useJoinSession = ({
  hashId,
  authToken,
}: {
  hashId: string;
  authToken?: string;
}) => {
  return useQuery(['session'], () => joinSession({ hashId, authToken }));
};
