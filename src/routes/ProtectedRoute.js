import useAuth from '@/utils/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';



const ProtectedRoute = (roleRequired) => {
  const { auth, role } = useAuth();
  const location = useLocation();
  const roles = ['ROLE_OWNER', 'ROLE_SELLER','ROLE_STOREKEEPER'];
  // console.log(roleRequired?.roleRequired === role && roles.includes(role))
  // console.log("26", roleRequired.roleRequired === role)
  // console.log('27', roles.includes(role))
  // console.log("28", roleRequired)
  if (roleRequired.roleRequired !== undefined) {
    return auth ? (
      roleRequired.roleRequired === role && roles.includes(role) ? (
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
