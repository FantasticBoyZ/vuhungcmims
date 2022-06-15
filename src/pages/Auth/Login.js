import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';
import LayoutLogin from '@/components/Layout/AuthLayout/Login';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Button from '@/components/FormsUI/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import '@/components/Layout/AuthLayout/Login.css';
import { LockOutlined } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Textfield from '@/components/FormsUI/Textfield';

const Login = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const INITIAL_FORM_STATE = {
    username: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required.'),
  });

  const handleLogin = (e) => {
    // e.preventDefault();
    setMessage('');
    setLoading(true);
    console.log(e);
    AuthService.login(e.username, e.password).then(
      () => {
        navigate('/dashboard');
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      },
    );
  };

  return (
    <LayoutLogin>
      <Grid
        item
        component="main"
        sx={{ height: '100vh' }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '32px',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.light' }}>
            <LockOutlined />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
          >
            Sign in
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Formik
              initialValues={{
                ...INITIAL_FORM_STATE,
              }}
              validationSchema={FORM_VALIDATION}
              onSubmit={handleLogin}
            >
              <Form>
                <Textfield
                  name="username"
                  label="Email"
                  margin="normal"
                  fullWidth
                  id="email"
                  autoComplete="email"
                  autoFocus
                  // value={username}
                  // onChange={onChangeUsername}
                />

                <Textfield
                  name="password"
                  label="Mật khẩu"
                  margin="normal"
                  fullWidth
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  // value={password}
                  // onChange={onChangePassword}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                    />
                  }
                  label="Lưu đăng nhập"
                />
                <Button
                  fullWidth={true}
                  type="submit"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Đăng nhập
                </Button>
              </Form>
            </Formik>
            <Grid container>
              <Grid
                item
                xs
              >
                <Link
                  href="#"
                  variant="body2"
                >
                  Quên mật khẩu?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                >
                  {'Bạn chưa có tài khoản? Đăng ký'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </LayoutLogin>
  );
};
export default Login;
