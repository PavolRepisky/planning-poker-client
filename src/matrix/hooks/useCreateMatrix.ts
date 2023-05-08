import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import { addOne } from 'core/utils/crudUtils';
import Matrix from 'matrix/types/MatrixData';

let axios: AxiosInstance;

const createMatrix = async (matrix: Partial<Matrix>): Promise<Matrix> => {
  const { data } = await axios.post('/matrices', matrix);
  return data.data.matrix;
};

export const useCreateMatrix = () => {
  axios = useAxios();
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(createMatrix, {
    onSuccess: (matrix: Matrix) => {
      queryClient.setQueryData<Matrix[]>(['matrices'], (oldMatrices) =>
        addOne(oldMatrices, matrix)
      );
    },
  });

  return { isCreating: isLoading, createMatrix: mutateAsync };
};
