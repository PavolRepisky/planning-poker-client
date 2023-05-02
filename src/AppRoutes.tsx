import PrivateRoutes from 'core/components/PrivateRoutes';
import PublicRoutes from 'core/components/PublicRoutes';
import QueryWrapper from 'core/components/QueryWrapper';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Core
const AppLayout = lazy(() => import('./core/pages/AppLayout'));
const NotFound = lazy(() => import('core/pages/NotFound'));
const Landing = lazy(() => import('core/pages/Landing'));

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

// Session
const SessionHomepage = lazy(() => import('./session/pages/SessionHomepage'));
const SessionJoinManager = lazy(
  () => import('./session/pages/SessionJoinManager')
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/" element={<AppLayout />}>
        <Route path="sessions/:hashId" element={<SessionJoinManager />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<AppLayout />}>
          <Route path="matrices" element={<MatrixManagement />} />
          <Route path="matrices/:matrixId" element={<MatrixView />} />

          <Route path="sessions" element={<SessionHomepage />} />

          <Route path="profile" element={<Profile />}>
            <Route path="" element={<ProfileInformation />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        path="test"
        element={
          <QueryWrapper>
            <div>Test</div>
          </QueryWrapper>
        }
      />

      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to={`/404`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
