import { useAuth } from 'auth/contexts/AuthProvider';
import { Navigate, Outlet } from 'react-router';

const PrivateRoutes = () => {
  const { userData } = useAuth();

  return !userData ? <Navigate to="/login" /> : <Outlet />;
};

export default PrivateRoutes;
