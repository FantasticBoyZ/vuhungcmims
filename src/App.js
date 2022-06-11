import  DefaultLayout  from '@/components/Layout/DefaultLayout/DefaultLayout';
import { privateRoutes, publicRoutes } from '@/routes';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

const App = () => {
//   const [showModeratorBoard, setShowModeratorBoard] = useState(false);
//   const [showAdminBoard, setShowAdminBoard] = useState(false);
//   const [currentUser, setCurrentUser] = useState(undefined);
//   useEffect(() => {
//     const user = AuthService.getCurrentUser();
//     if (user) {
//       setCurrentUser(user);
//       setShowModeratorBoard(user.roles.includes('ROLE_MODERATOR'));
//       setShowAdminBoard(user.roles.includes('ROLE_ADMIN'));
//     }
//   }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
        {/* public route sẽ không có ProtectedRoute bao quanh */}
          {publicRoutes.map((route, index) => {
            const Layout = route.layout === null ? Fragment : DefaultLayout;
            const Page = route.component;
            return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
            );
          })}
        {/* private route sẽ có ProtectedRoute bao quanh nếu chưa đăng nhập tự động navigate đến trang login */}
          <Route
            path="/"
            element={<ProtectedRoute />}
          >
            {privateRoutes.map((route, index) => {
              const Layout = route.layout === null ? Fragment : DefaultLayout;
              const Page = route.component;
              return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />
              );
            })}
          </Route>

        </Routes>
      </div>
    </Router>
    
  );
};
export default App;
