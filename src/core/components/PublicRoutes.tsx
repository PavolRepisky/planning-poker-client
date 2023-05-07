import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

const PublicRoutes = () => {
  const { userData } = useAuth();

  return userData ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoutes;
