import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

function PublicRoutes() {
  const { authToken } = useAuth();
  return authToken ? <Navigate to="/dashboard" /> : <Outlet />;
}

export default PublicRoutes;
