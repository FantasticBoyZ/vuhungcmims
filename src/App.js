import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import AuthService from './services/auth.service';
import { privateRoutes, publicRoutes } from '@/routes';
import { DefaultLayout } from '@/components/Layout/NotFound';
import Login from './components/AuthComponent/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import BoardUser from './components/BoardUser';
import BoardModerator from './components/BoardModerator';
import BoardAdmin from './components/BoardAdmin';
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
