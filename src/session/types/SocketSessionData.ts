import SocketSessionUserData from './SocketSessionUserData';
import SocketVotingData from './SocketSessionVotingData';

interface SocketSessionData {
  users: SocketSessionUserData[];
  voting?: SocketVotingData;
  showVotes: false;
}

export default SocketSessionData;
