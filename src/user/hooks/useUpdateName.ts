import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'core/config/axios';
import UserData from 'user/types/userData';

const updateName = async ({
  firstName,
  lastName,
  authToken,
}: {
  firstName: string;
  lastName: string;
  authToken: string;
}): Promise<UserData> => {
  const { data } = await axios.patch(
    '/users/name',
    { firstName, lastName },
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  return data.data.user;
};

export function useUpdateName(authToken: string) {
  const queryClient = useQueryClient();

  const { isLoading, mutateAsync } = useMutation(updateName, {
    onSuccess: (userData: UserData) => {
      queryClient.setQueryData(['user-info', authToken], userData);
    },
  });

  return { isUpdating: isLoading, updateName: mutateAsync };
}
