import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'core/config/axios';
import { updateOne } from 'core/utils/crudUtils';
import Matrix from 'matrix/types/MatrixData';

const updateMatrix = async (matrix: Matrix): Promise<Matrix> => {
  const { id, ...matrixData } = matrix;

  const { data } = await axios.patch(`/matrices/${matrix.id}`, matrixData);
  return data.data.matrix;
};

export const useUpdateMatrix = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateMatrix, {
    onSuccess: (matrix: Matrix) => {
      queryClient.setQueryData<Matrix[]>(['matrices'], (oldMatrices) =>
        updateOne(oldMatrices, matrix)
      );

      queryClient.setQueryData<Matrix>(['matrix', matrix.id], matrix);
    },
  });

  return { isUpdating: isLoading, updateMatrix: mutateAsync };
};
