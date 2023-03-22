import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const socket = io(URL, {
  autoConnect: false,
});

export default socket;
