import { useQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import Matrix from 'matrix/types/MatrixData';

let axios: AxiosInstance;

const fetchMatrix = async (matrixId: number): Promise<Matrix | null> => {
  try {
    const { data } = await axios.get(`/matrices/${matrixId}`);
    return data.data.matrix;
  } catch {
    return null;
  }
};

export const useGetMatrix = (matrixId: number) => {
  axios = useAxios();
  const { data } = useQuery(['matrix', matrixId], () => fetchMatrix(matrixId));
  return { data: data ?? undefined };
};
