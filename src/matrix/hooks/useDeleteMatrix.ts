import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import { removeOne } from 'core/utils/crudUtils';
import Matrix from 'matrix/types/MatrixData';

let axios: AxiosInstance;

const deleteMatrix = async (id: number): Promise<Matrix> => {
  const { data } = await axios.delete(`/matrices/${id}`);
  return data.data.matrix;
};

export const useDeleteMatrix = () => {
  axios = useAxios();
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
