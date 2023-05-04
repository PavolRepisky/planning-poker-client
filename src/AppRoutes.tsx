import PrivateRoutes from 'core/components/PrivateRoutes';
import PublicRoutes from 'core/components/PublicRoutes';
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Core
const AppLayout = lazy(() => import('./core/pages/AppLayout'));
const NotFound = lazy(() => import('core/pages/NotFound'));
const Landing = lazy(() => import('core/pages/Landing'));

// Auth
const Register = lazy(() => import('./auth/pages/Register'));
const Login = lazy(() => import('./auth/pages/Login'));
const ForgotPassword = lazy(() => import('./auth/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./auth/pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./auth/pages/VerifyEmail'));

// User
const Profile = lazy(() => import('./user/pages/Profile'));
const ProfileInformation = lazy(
  () => import('./user/pages/ProfileInformation')
);
const ProfilePassword = lazy(() => import('./user/pages/ProfilePassword'));

// Matrix
const MatrixHomepage = lazy(() => import('./matrix/pages/MatrixHomepage'));
const MatrixDetail = lazy(() => import('./matrix/pages/MatrixDetail'));

// Session
const SessionHomepage = lazy(() => import('./session/pages/SessionHomepage'));
const SessionJoinManager = lazy(
  () => import('./session/pages/SessionJoinManager')
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="sessions/:hashId" element={<SessionJoinManager />} />
      </Route>

      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/verify-email/:verificationCode" element={<VerifyEmail />} />

      <Route element={<PrivateRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/matrices" element={<MatrixHomepage />} />
          <Route path="/matrices/:matrixId" element={<MatrixDetail />} />

          <Route path="sessions" element={<SessionHomepage />} />

          <Route path="profile" element={<Profile />}>
            <Route path="" element={<ProfileInformation />} />
            <Route path="password" element={<ProfilePassword />} />
          </Route>
        </Route>
      </Route>

      <Route element={<PublicRoutes />}>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to={`/404`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
