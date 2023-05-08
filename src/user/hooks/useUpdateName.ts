import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import UserData from 'user/types/userData';

let axios: AxiosInstance;

const updateName = async ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): Promise<UserData> => {
  const { data } = await axios.patch('/users/name', {
    firstName,
    lastName,
  });
  return data.data.user;
};

export function useUpdateName(accessToken: string) {
  axios = useAxios();
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateName, {
    onSuccess: (userData: UserData) => {
      queryClient.setQueryData(['user-info', accessToken], userData);
    },
  });

  return { isUpdating: isLoading, updateName: mutateAsync };
}
