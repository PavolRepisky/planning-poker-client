import { useQuery } from '@tanstack/react-query';
import axios from 'core/config/axios';
import UserData from 'user/types/userData';

const fetchUser = async (): Promise<UserData | null> => {
  try {
    const { data } = await axios.get('/users');
    return data.data.user;
  } catch {
    return null;
  }
};

export function useGetUser(key?: string) {
  const { data } = useQuery(['user-info', key], () => fetchUser(), {
    enabled: !!key,
  });

  return { data: data ?? undefined };
}
