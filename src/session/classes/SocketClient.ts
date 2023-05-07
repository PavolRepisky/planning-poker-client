import config from 'core/config/config';
import SocketSessionData from 'session/types/SocketSessionData';
import SocketSessionJoinUserData from 'session/types/SocketSessionJoinUserData';
import SocketSessionUserData from 'session/types/SocketSessionUserData';
import SocketSessionUserVoteData from 'session/types/SocketSessionUserVoteData';
import SocketSessionVotingData from 'session/types/SocketSessionVotingData';
import { io, Socket } from 'socket.io-client';

class SocketClient {
  static instance: SocketClient;
  socket: Socket;

  constructor() {
    const host = config.origin;

    this.socket = io(host, {
      autoConnect: false,
    });
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  connect() {
    this.socket.connect();
  }

  disconnect = () => {
    this.socket.disconnect();
  };

  getUserData = (
    sessionHashId: string,
    connectionId: string,
    callback: (sessionData: SocketSessionUserData | null) => void
  ) => {
    console.log('emit sent')
    this.socket.emit(
      'getUser',
      sessionHashId,
      connectionId,
      (response: SocketSessionUserData | null) => {
        callback(response);
      }
    );
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
