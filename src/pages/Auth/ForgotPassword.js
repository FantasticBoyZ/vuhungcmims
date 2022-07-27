import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Textfield from '@/components/Common/FormsUI/Textfield';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Form, Formik, FormikConfig, FormikValues, FormikHelpers } from 'formik';
import * as Yup from 'yup';

const useStyles = makeStyles({
  styleForm: {
    width: '410px',
    paddingTop: '5%',
    lineHeight: '26px',
  },
});

export default function ForgotPassword() {
  const classes = useStyles();

  return (
    <Grid
      item
      component="main"
    >
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '32px',
        }}
      >
        <Typography
          component="h1"
          variant="h5"
        >
          Quên mật khẩu
        </Typography>

        <Box sx={{ mt: 1 }} className={classes.styleForm}>
          <label htmlFor="email">
            Bạn quên mật khẩu? vui lòng điền mã nhân viên đã dùng để đăng ký tài khoản của
            bạn ở đây.
          </label>
          <Textfield
            name="userName"
            label="Mã nhân viên"
            margin="normal"
            fullWidth
            id="userName"
            autoComplete="userName"
          />

        </Box>
      </Box>
    </Grid>
  );
}
