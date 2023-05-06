import axios from 'axios';
import appConfig from 'core/config/config';

const instance = axios.create({
  baseURL: appConfig.origin,
  headers: {
    'Content-type': 'application/json',
  },
  withCredentials: true,
});

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

export default instance;
