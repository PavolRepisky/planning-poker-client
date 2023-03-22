import { useGetUser } from 'auth/hooks/useGetUser';
import { useLogin } from 'auth/hooks/useLogin';
import UserData from 'auth/types/userData';
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../../core/hooks/useLocalStorage';

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
  const { isLoggingIn, login } = useLogin();
  const { data: userData } = useGetUser(authToken);

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await login({ email, password });
      setAuthToken(data.data.token);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      setAuthToken('');
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
