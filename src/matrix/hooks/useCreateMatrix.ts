import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'core/config/axios';
import { addOne } from 'core/utils/crudUtils';
import Matrix from 'matrix/types/Matrix';

const createMatrix = async ({
  matrix,
  authToken,
}: {
  matrix: Partial<Matrix>;
  authToken: string;
}): Promise<Matrix> => {
  const { data } = await axios.post('/matrices', matrix, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data.data.matrix;
};

export const useCreateMatrix = () => {
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
