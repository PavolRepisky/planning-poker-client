import { UserData } from './userData';

export default interface RegisterSuccessResponse {
  message: string;
  data: {
    user: UserData;
  };
}
