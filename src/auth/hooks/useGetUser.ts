import { useQuery } from '@tanstack/react-query';
import UserInfo from 'auth/types/userInfo';
import axios from 'core/config/axios';

const fetchUserInfo = async (authToken?: string): Promise<UserInfo> => {
  const { data } = await axios.get('/me', {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return data;
};

export const useGetUser = (authToken?: string) => {
  try {
    return useQuery(['user-info', authToken], () => fetchUserInfo(authToken), {
      enabled: !!authToken,
      onError: () => undefined,
    });
  } catch {
    return { data: undefined };
  }
};
