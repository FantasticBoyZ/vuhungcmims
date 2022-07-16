import Button from '@/components/Common/FormsUI/Button';
import Textfield from '@/components/Common/FormsUI/Textfield';
import LayoutLogin from '@/components/Layout/AuthLayout/Login';
import '@/components/Layout/AuthLayout/Login.css';
import AuthService from '@/services/authService';
import { LockOutlined } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  styleBox: {
    margin: '8% auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px',
    width: '375px',
    background: '#fff',
    boxShadow: '4px 4px 4px 4px rgba(0, 0, 0, 0.25);'
  },
});

const Login = () => {
  let navigate = useNavigate();
  const classes = useStyles()
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(false);

  const INITIAL_FORM_STATE = {
    username: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    username: Yup.string()
      .required('Vui lòng nhập tên đăng nhập'),
    password: Yup.string()
      // .min(8, "Vui lòng nhập ít nhất 8 kí tự")
      .max(50, "Vui lòng nhập không vượt quá 50 kí tự")
      .required('Vui lòng nhập mật khẩu'),
  });

  const handleLogin = (e) => {
    // e.preventDefault();
    setMessage('');
    setLoading(true);
    console.log(e);
    AuthService.login(e.username, e.password).then(
      () => {
        setDisabled(true);
        navigate('/dashboard');
        // window.location.reload();
        toast.success('Đăng nhập thành công!');
      },
      (error) => {
        const resMessage =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        // toast.error(resMessage);
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
      >
        <Box className={classes.styleBox}
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
              onSubmit={(e) => handleLogin(e)}
            >
              <Form>
                <Textfield
                  name="username"
                  label="Tên đăng nhập"
                  margin="normal"
                  fullWidth
                  id="username"
                  autoComplete="username"
                // autoFocus
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
                  fullWidth
                  variant='contained'
                  disabled={disabled}
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
                  href="/forgotPassword"
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
