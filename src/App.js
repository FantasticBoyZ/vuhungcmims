import DefaultLayout from '@/components/Layout/DefaultLayout/DefaultLayout';
import { privateRoutes, publicRoutes } from '@/routes';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import PublicRoute from '@/routes/PublicRoute';

const App = () => {

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* public route sẽ không có ProtectedRoute bao quanh */}
          <Route
            path="/"
            element={<PublicRoute />}
          >
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
          </Route>
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
            <Route
              path="/admin"
              element={<ProtectedRoute roleRequired="ROLE_ADMIN" />}
            >
              <Route
                path="/admin"
                element={<DefaultLayout />}
              ></Route>
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};
export default App;
