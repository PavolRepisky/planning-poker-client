import axios from 'axios';
import config from 'core/config/config';

const instance = axios.create({
  baseURL: config.origin,
  headers: {
    'Content-type': 'application/json',
  },
});

export default instance;
