import { useQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import {
  default as Matrix,
  default as MatrixData,
} from 'matrix/types/MatrixData';

let axios: AxiosInstance;

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
  axios = useAxios();
  return useQuery(['matrices'], () => fetchMatrices());
};
