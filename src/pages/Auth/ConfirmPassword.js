import * as React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Textfield from '@/components/Common/FormsUI/Textfield';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import { Form, Formik, FormikConfig, FormikValues, FormikHelpers } from 'formik';
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const useStyles = makeStyles({
  styleForm: {
    width: '410px',
    paddingTop: '5%',
    lineHeight: '26px',
  },
});
export default function ConfirmPassword() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
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

        <Box
          sx={{ mt: 1 }}
          className={classes.styleForm}
        >
          <label>
            Hãy điền dãy số mã hóa mà bạn đã nhận được ở trong email của mình để được cấp
            quyền cài đặt lại mật khẩu
          </label>
          <Textfield
            name="password"
            label="Mật khẩu mới"
            margin="normal"
            fullWidth
            id="password"
            type={passwordShown ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={passwordShown ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  arrow
                >
                  <IconButton onClick={() => setPasswordShown(!passwordShown)}>
                    {passwordShown ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              ),
            }}
            autoComplete="password"
          />

          <Textfield
            name="confirmPassword"
            label="Nhập lại mật khẩu mới"
            margin="normal"
            fullWidth
            type={confirmPasswordShown ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={confirmPasswordShown ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  arrow
                >
                  <IconButton onClick={() => setConfirmPasswordShown(!confirmPasswordShown)}>
                    {confirmPasswordShown ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              ),
            }}
            id="confirmPassword"
            autoComplete="confirmPassword"
          />
        </Box>
      </Box>
    </Grid>
  );
}
