import { useLogin } from 'auth/hooks/useLogin';
import { UserData } from 'auth/types/userData';
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../../core/hooks/useLocalStorage';

interface AuthContextInterface {
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  userData?: UserData;
  authToken: string;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '');
  const [userData, setUserData] = useLocalStorage<string>(
    'userData',
    JSON.stringify({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
    } as UserData)
  );

  const { isLoggingIn, login } = useLogin();

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login({ email, password });
      setAuthToken(data.data.token);
      setUserData(JSON.stringify(data.data.user));
      return data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggingIn,
        login: handleLogin,
        userData: JSON.parse(userData),
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
