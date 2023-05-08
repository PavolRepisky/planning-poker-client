import axios from 'axios';
import appConfig from 'core/config/config';
import { useTranslation } from 'react-i18next';

const useAxios = () => {
  const { i18n } = useTranslation();

  const instance = axios.create({
    baseURL: appConfig.origin,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': i18n.language,
    },
    withCredentials: true,
  });

  console.log('axios created with language=', i18n.language);

  instance.interceptors.request.use(
    (config) => {
      const item = localStorage.getItem(appConfig.accessTokenKey);
      const accessToken = item ? JSON.parse(item) : '';
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;

      if (originalConfig && originalConfig.url !== '/login' && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;

          try {
            const { data } = await instance.get('/refresh');
            const item = data.data.accessToken;
            const accessToken = item ? JSON.stringify(item) : '';

            localStorage.setItem(appConfig.accessTokenKey, accessToken);

            return instance(originalConfig);
          } catch (error) {
            localStorage.removeItem(appConfig.accessTokenKey);
            return Promise.reject(error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
  return instance;
};

export default useAxios;
