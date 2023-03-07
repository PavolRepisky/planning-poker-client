import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

function PrivateRoutes() {
  const { authToken } = useAuth();
  return !authToken ? <Navigate to="/login" /> : <Outlet />;
}

export default PrivateRoutes;
