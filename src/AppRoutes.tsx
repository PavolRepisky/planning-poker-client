import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

// Auth
const Register = lazy(() => import('./auth/pages/Register'));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
