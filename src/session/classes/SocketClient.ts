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
    this.socket.emit(
      'get_user',
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
    callback: (data: {
      sessionData: SocketSessionData;
      userVote: SocketSessionUserVoteData | null;
    }) => void
  ) => {
    this.socket.emit(
      'join_session',
      sessionHashId,
      userData,
      (response: {
        sessionData: SocketSessionData;
        userVote: SocketSessionUserVoteData | null;
      }) => {
        callback(response);
      }
    );
  };

  createVoting = (votingData: SocketSessionVotingData) => {
    this.socket.emit('create_voting', votingData);
  };

  showVotes = () => {
    this.socket.emit('show_votes');
  };

  vote = (vote: SocketSessionUserVoteData) => {
    this.socket.emit('vote', vote);
  };

  setupSessionUpdateListener = (
    callback: (sessionData: SocketSessionData) => void
  ) => {
    this.socket.on('session_update', (sessionData: SocketSessionData) => {
      callback(sessionData);
    });
  };

  setupVoteUpdateListener = (
    callback: (voteData: SocketSessionUserVoteData | null) => void
  ) => {
    this.socket.on(
      'vote_update',
      (voteData: SocketSessionUserVoteData | null) => {
        callback(voteData);
      }
    );
  };
}

export default SocketClient;
