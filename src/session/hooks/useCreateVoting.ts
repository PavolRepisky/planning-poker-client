import { useMutation } from '@tanstack/react-query';
import axios from 'core/config/axios';
import VotingData from 'session/types/VotingData';

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
  const { isLoading, mutateAsync } = useMutation(createVoting);
  return { isCreating: isLoading, createVoting: mutateAsync };
};
