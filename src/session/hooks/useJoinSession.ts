import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import MatrixData from 'matrix/types/MatrixData';
import Session from 'session/types/Session';

const joinSession = async ({
  hashId,
  authToken,
}: {
  hashId: string;
  authToken?: string;
}): Promise<{ session: Session; matrix: MatrixData }> => {
  const { data } = await axios.get(`/sessions/${hashId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data;
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
