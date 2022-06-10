import AuthService from '@/services/authService';
import React from 'react';
import { Navigate,  Outlet,  useLocation } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, layout:Layout, ...rest }) => {
  const user = AuthService.getCurrentUser();
  const location = useLocation();
  return (
    // <Route
    //   {...rest}
    //   render={(props) =>
    //     !!user ? (
    //     //   <Layout {...props}>
    //     //     <Component {...props} />
    //     //   </Layout>
    //     <Outlet/>
    //     ) : (
    //       <Navigate to="/login"  state={{ from: location}} replace/>
    //     )
    //   }
    // />
    !!user ? (
        //   <Layout {...props}>
        //     <Component {...props} />
        //   </Layout>
        <Outlet/>
        ) : (
          <Navigate to="/login"  state={{ from: location}} replace/>
        )
  );
};

export default ProtectedRoute;
