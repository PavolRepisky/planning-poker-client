import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserInfo from 'auth/types/userInfo';
import axios from 'core/config/axios';

const updateName = async ({
  firstName,
  lastName,
  authToken,
}: {
  firstName: string;
  lastName: string;
  authToken: string;
}): Promise<UserInfo> => {
  const { data } = await axios.patch(
    '/user/name',
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
    onSuccess: (userInfo: UserInfo) => {
      queryClient.setQueryData(['user-info', authToken], userInfo);
    },
  });

  return { isUpdating: isLoading, updateName: mutateAsync };
}
