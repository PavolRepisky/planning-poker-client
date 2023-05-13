import config from 'core/config/config';
import { io } from 'socket.io-client';

const socket = io(config.origin, {
  autoConnect: false,
});

export default socket;
