import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import {
  default as Matrix,
  default as MatrixData,
} from 'matrix/types/MatrixData';

const fetchMatrices = async (authToken: string): Promise<Matrix[]> => {
  const { data } = await axios.get('/matrices', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return data.data.matrices.map((matrix: MatrixData) => {
    return {
      ...matrix,
      createdAt: Date.parse(matrix.createdAt.toString()),
    };
  });
};

export const useGetMatrices = (authToken: string) => {
  return useQuery(['matrices'], () => fetchMatrices(authToken));
};
