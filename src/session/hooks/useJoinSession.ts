import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import MatrixData from 'matrix/types/MatrixData';
import SessionData from 'session/types/SessionData';

let axios: AxiosInstance;

const joinSession = async (
  hashId: string
): Promise<{ session: SessionData; matrix: MatrixData }> => {
  const { data } = await axios.get(`/sessions/${hashId}`);
  return data.data;
};

export const useJoinSession = () => {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(joinSession);
  return { isJoining: isLoading, joinSession: mutateAsync };
};
