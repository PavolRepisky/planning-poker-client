import SocketVote from './SocketSessionUserVoteData';

interface SocketSessionUserData {
  firstName: string;
  lastName: string;
  voted: boolean;
  connectionId: string;
}

export default SocketSessionUserData;
