import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'core/config/axios';
import { removeOne } from 'core/utils/crudUtils';
import Matrix from 'matrix/types/MatrixData';

const deleteMatrix = async (id: number): Promise<Matrix> => {
  const { data } = await axios.delete(`/matrices/${id}`);
  return data.data.matrix;
};

export const useDeleteMatrix = () => {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(deleteMatrix, {
    onSuccess: (matrix: Matrix) => {
      queryClient.setQueryData<Matrix[]>(['matrices'], (oldMatrices) =>
        removeOne(oldMatrices, matrix.id)
      );
    },
  });

  return { isDeleting: isLoading, deleteMatrix: mutateAsync };
};
