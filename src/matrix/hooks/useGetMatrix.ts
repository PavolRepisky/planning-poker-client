import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import Matrix from 'matrix/types/MatrixData';

const fetchMatrix = async ({
  matrixId,
  authToken,
}: {
  matrixId: number;
  authToken: string;
}): Promise<Matrix> => {
  const { data } = await axios.get(`/matrices/${matrixId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data.matrix;
};

export const useGetMatrix = (matrixId: number, authToken: string) => {
  return useQuery(['session-matrix'], () =>
    fetchMatrix({ matrixId, authToken })
  );
};
