import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import {
  default as Matrix,
  default as MatrixData,
} from 'matrix/types/MatrixData';

const fetchMatrices = async (): Promise<Matrix[]> => {
  const { data } = await axios.get('/matrices');

  return data.data.matrices.map((matrix: MatrixData) => {
    return {
      ...matrix,
      createdAt: Date.parse(matrix.createdAt.toString()),
    };
  });
};

export const useGetMatrices = () => {
  return useQuery(['matrices'], () => fetchMatrices());
};
