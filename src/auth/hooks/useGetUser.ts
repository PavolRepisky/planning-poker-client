import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import UserData from 'user/types/userData';

const fetchUser = async (authToken?: string): Promise<UserData | null> => {
  try {
    const { data } = await axios.get('/users', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return data.data.user;
  } catch {
    return null;
  }
};

export const useGetUser = (authToken?: string) => {
  const { data } = useQuery(
    ['user-data', authToken],
    () => fetchUser(authToken),
    {
      enabled: !!authToken,
    }
  );
  return { data: data ?? undefined };
};
