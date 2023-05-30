import { useGetUser } from 'auth/hooks/useGetUser';
import { useLogin } from 'auth/hooks/useLogin';
import { useLogout } from 'auth/hooks/useLogout';
import config from 'core/config/config';
import { useLocalStorage } from 'core/hooks/useLocalStorage';
import React, { createContext, useContext } from 'react';
import UserData from 'user/types/userData';

interface AuthContextInterface {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  resetAccessToken: () => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  userData?: UserData;
  accessToken: string;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useLocalStorage<string>(
    config.accessTokenKey,
    ''
  );

  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const { data: userData } = useGetUser(accessToken);

  const handleLogin = async (email: string, password: string) => {
    try {
      const accessToken = await login({ email, password });
      setAccessToken(accessToken);
    } catch (err) {
      throw err;
    }
  };

  const resetAccessToken = () => {
    setAccessToken('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      resetAccessToken();
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggingIn,
        isLoggingOut,
        resetAccessToken,
        login: handleLogin,
        logout: handleLogout,
        userData,
        accessToken,
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
