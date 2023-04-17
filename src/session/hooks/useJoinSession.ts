import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';
import MatrixData from 'matrix/types/MatrixData';
import SessionData from 'session/types/SessionData';

const joinSession = async ({
  hashId,
  authToken,
}: {
  hashId: string;
  authToken?: string;
}): Promise<{ session: SessionData; matrix: MatrixData }> => {
  const { data } = await axios.get(`/sessions/${hashId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data;
};

export const useJoinSession = () => {
  const { isLoading, mutateAsync } = useMutation(joinSession);
  return { isJoining: isLoading, joinSession: mutateAsync };
};
