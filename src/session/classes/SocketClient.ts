import socket from 'core/config/socket';
import SocketSessionData from 'session/types/SocketSessionData';
import SocketSessionJoinUserData from 'session/types/SocketSessionJoinUserData';
import SocketSessionUserVoteData from 'session/types/SocketSessionUserVoteData';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';
import { io, Socket } from 'socket.io-client';

class SocketClient {
  static instance: SocketClient;
  connectionId: string;
  socket: Socket;

  constructor(connectionId: string) {
    const host = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

    this.socket = io(host, {
      autoConnect: false,
    });
    this.connectionId = connectionId;
  }

  public static getInstance(connectionId: string): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient(connectionId);
    }
    return SocketClient.instance;
  }

  connect() {
    this.socket.connect();
  }

  disconnect = () => {
    this.socket.disconnect();
  };

  joinSession = (
    sessionHashId: string,
    userData: SocketSessionJoinUserData,
    callback: (sessionData: SocketSessionData) => void
  ) => {
    this.socket.emit(
      'joinSession',
      sessionHashId,
      userData,
      (response: SocketSessionData) => {
        callback(response);
      }
    );
  };

  createVoting = (votingData: SocketSessionVotingData) => {
    this.socket.emit('createVoting', votingData);
  };

  showVotes = () => {
    this.socket.emit('showVotes');
  };

  vote = (vote: SocketSessionUserVoteData) => {
    this.socket.emit('vote', vote);
  };

  setupSessionUpdateListener = (
    callback: (sessionData: SocketSessionData) => void
  ) => {
    this.socket.on('sessionUpdate', (sessionData: SocketSessionData) => {
      callback(sessionData);
    });
  };
}

export default SocketClient;
