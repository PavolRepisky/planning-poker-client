import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

function PrivateRoutes() {
  const { userInfo } = useAuth();
  console.log('user=' + userInfo)
  return !userInfo ? <Navigate to="/login" /> : <Outlet />;
}

export default PrivateRoutes;
