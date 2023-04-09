import socket from 'core/config/socket';
import UserData from 'session/types/UserData';
import VoteCardData from 'session/types/VoteCardData';

const connect = () => {
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
};

const emitVote = (voteCardData: VoteCardData) => {
  socket.emit('vote', voteCardData);
};

const emitJoinSession = (sessionId: string, newUserData: UserData) => {
  socket.emit('joinSession', sessionId, newUserData);
};

const setupUsersListener = (callback: (users: UserData[]) => void) => {
  socket.on('users', (users: UserData[]) => {
    callback(users);
  });
};

const socketManager = {
  connect,
  disconnect,
  setupUsersListener,
  emitVote,
  emitJoinSession,
};

export default socketManager;
