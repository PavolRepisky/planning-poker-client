import PrivateRoutes from 'core/components/PrivateRoutes';
import PublicRoutes from 'core/components/PublicRoutes';
import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Core
const AppLayout = lazy(() => import('./core/pages/AppLayout'));

// Auth
const Register = lazy(() => import('./auth/pages/Register'));
const Login = lazy(() => import('./auth/pages/Login'));

// User
const Profile = lazy(() => import('./user/pages/Profile'));
const ProfileInformation = lazy(
  () => import('./user/pages/ProfileInformation')
);
const ProfilePassword = lazy(() => import('./user/pages/ProfilePassword'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="profile" element={<Profile />}>
            <Route path="" element={<ProfileInformation />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
