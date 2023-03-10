import { useQuery } from '@tanstack/react-query';
import UserInfo from 'auth/types/userInfo';
import axios from 'core/config/axios';

const fetchUserInfo = async (authToken?: string): Promise<UserInfo | null> => {
  try {
    const { data } = await axios.get('/me', {
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
    ['user-info', authToken],
    () => fetchUserInfo(authToken),
    {
      enabled: !!authToken,
    }
  );
  return { data: data ?? undefined };
};
