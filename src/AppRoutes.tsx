import PrivateRoutes from 'core/components/PrivateRoutes';
import PublicRoutes from 'core/components/PublicRoutes';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import VotingSession from 'session/pages/VotingSession';
import VotingSessionManagement from 'session/pages/VotingSessionManagment';

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

// Matrix
const MatrixManagement = lazy(() => import('./matrix/pages/MatrixManagement'));
const MatrixView = lazy(() => import('./matrix/pages/MatrixView'));

// Core
const NotFound = lazy(() => import('core/pages/NotFound'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="matrices" element={<MatrixManagement />} />
          <Route path="matrices/:matrixId" element={<MatrixView />} />

          <Route path="sessions" element={<VotingSessionManagement />} />
          <Route path="sessions/:hashId" element={<VotingSession />} />

          <Route path="profile" element={<Profile />}>
            <Route path="" element={<ProfileInformation />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
        </Route>
      </Route>

      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to={`/404`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
