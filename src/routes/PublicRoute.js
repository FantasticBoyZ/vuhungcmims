import useAuth from '@/utils/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const PublicRoute = () => {
  const location = useLocation();
  const { auth } = useAuth();

  return auth ? (
    <Navigate
      to="/dashboard"
      state={{ from: location }}
      replace
    />
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
