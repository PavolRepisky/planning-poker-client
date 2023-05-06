import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

const PublicRoutes = () => {
  const { userData } = useAuth();

  return userData ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
