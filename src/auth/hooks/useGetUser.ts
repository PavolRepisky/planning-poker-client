import { useQuery } from '@tanstack/react-query';
import { AxiosInstance } from 'axios';
import useAxios from 'core/hooks/useAxios';
import UserData from 'user/types/userData';

let axios: AxiosInstance;

const fetchUser = async (): Promise<UserData | null> => {
  try {
    const { data } = await axios.get('/users');
    return data.data.user;
  } catch {
    return null;
  }
};

export function useGetUser(key?: string) {
  axios = useAxios();
  const { data } = useQuery(['user-info', key], () => fetchUser(), {
    enabled: !!key,
  });
  return { data: data ?? undefined };
}
