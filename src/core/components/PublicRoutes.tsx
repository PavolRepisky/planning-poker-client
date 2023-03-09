import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

function PublicRoutes() {
  const { userInfo } = useAuth();

  return userInfo ? <Navigate to="/dashboard" /> : <Outlet />;
}

export default PublicRoutes;
