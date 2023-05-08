import { useMutation } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import VotingData from 'session/types/VotingData';

let axios: AxiosInstance;

const createVoting = async ({
  sessionHashId,
  votingData,
}: {
  sessionHashId: string;
  votingData: {
    name: string;
    description?: string;
  };
}): Promise<VotingData> => {
  const { data } = await axios.post(
    `/sessions/${sessionHashId}/voting`,
    votingData
  );
  return data.data.voting;
};

export const useCreateVoting = () => {
  axios = useAxios();
  const { isLoading, mutateAsync } = useMutation(createVoting);
  return { isCreating: isLoading, createVoting: mutateAsync };
};
