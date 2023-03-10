import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

const PrivateRoutes = () => {
  const { userInfo } = useAuth();
  return !userInfo ? <Navigate to="/login" /> : <Outlet />;
};

export default PrivateRoutes;
