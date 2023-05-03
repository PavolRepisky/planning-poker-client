import { useGetUser } from 'auth/hooks/useGetUser';
import { useLogin } from 'auth/hooks/useLogin';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import React, { createContext, useContext } from 'react';
import UserData from 'user/types/userData';

interface AuthContextInterface {
  isLoggingIn: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  userData?: UserData;
  authToken: string;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authToken, setAuthToken] = useLocalStorage<string>('authToken', '');
  const [_, setSocketConnectionId] = useLocalStorage<string | null>(
    'connectionId',
    null
  );

  const { isLoggingIn, login } = useLogin();
  const { data: userData } = useGetUser(authToken);

  const handleLogin = async (email: string, password: string) => {
    try {
      const accessToken = await login({ email, password });
      setAuthToken(accessToken);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setAuthToken('');
      setSocketConnectionId(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggingIn,
        login: handleLogin,
        logout: handleLogout,
        userData,
        authToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
