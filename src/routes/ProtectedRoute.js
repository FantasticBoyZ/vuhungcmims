import useAuth from '@/utils/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';



const ProtectedRoute = ({ acceptRole}) => {
  const { auth, role } = useAuth();
  const location = useLocation();
  const roles = ['ROLE_OWNER', 'ROLE_SELLER','ROLE_STOREKEEPER'];

  if (!!acceptRole) {
    return auth ? (
      acceptRole.includes(role) ? (
        <Outlet />
      ) : (
        <Navigate
          to="/denied"
          state={{ from: location }}
          replace
        />
      )
    ) : (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  } else {
    return  auth  ? (
      <Outlet />
    ) : (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }
};

export default ProtectedRoute;
