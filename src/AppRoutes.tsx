import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Auth
const Register = lazy(() => import('./auth/pages/Register'));
const Login = lazy(() => import('./auth/pages/Login'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
