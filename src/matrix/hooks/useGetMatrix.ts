import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import Matrix from 'matrix/types/MatrixData';

const fetchMatrix = async (matrixId: number): Promise<Matrix | null> => {
  try {
    const { data } = await axios.get(`/matrices/${matrixId}`);
    return data.data.matrix;
  } catch {
    return null;
  }
};

export const useGetMatrix = (matrixId: number) => {
  const { data } = useQuery(['matrix', matrixId], () => fetchMatrix(matrixId));
  return { data: data ?? undefined };
};
