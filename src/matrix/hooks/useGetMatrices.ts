import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import Matrix from 'matrix/types/Matrix';

const fetchMatrices = async (authToken?: string): Promise<Matrix[]> => {
  const { data } = await axios.get('/matrices', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data.matrices;
};

export const useGetMatrices = (authToken?: string) => {
  return useQuery(['matrices'], () => fetchMatrices(authToken));
};
