import { UserData } from './userData';

export default interface LoginSuccessResponse {
  message: string;
  data: {
    user: UserData;
    token: string;
  };
}
