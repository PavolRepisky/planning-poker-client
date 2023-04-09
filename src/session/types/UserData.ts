import CardData from './VoteCardData';

interface UserData {
  firstName: string;
  lastName: string;
  vote: CardData | null;
  socketSessionId: string;
}

export default UserData;
