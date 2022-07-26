import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import AuthService from '@/services/authService';
import { setNewPassword } from '@/slices/StaffSlice';
import { LockReset, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Card,
  Container,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { Navigate, useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  resetPasswordContainer: {
    width: '400px',
  },
  noteText: {
    color: '#666666',
    width: '400px',
  },
});
const ResetPassword = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => ({ ...state.staff }));
  const currentUser = AuthService.getCurrentUser();
  const initialFormValue = {
    oldPassword: '',
    newPassword: '',
    reNewPassword: '',
  };
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  const FORM_VALIDATION = Yup.object().shape({
    oldPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
    newPassword: Yup.string()
      .required('Vui lòng nhập mật khẩu mới')
      .min(8, 'Vui lòng nhập ít nhất 8 ký tự')
      .matches(
        /\d/,
        'Vui lòng nhập mật khẩu có ít 8 ký tự, trong đó có chứa cả chữ và số',
      ),
    reNewPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Mật khẩu mới và mật khẩu nhập lại không khớp',
    ),
  });
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [reNewPasswordShown, setReNewPasswordShown] = useState(false);

  const handleSubmit = async (values) => {
    console.log(values);
    const newPassword = {
      userName: currentUser.username,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    try {
      const actionResult = await dispatch(setNewPassword(newPassword));
      const dataResult = unwrapResult(actionResult);
      console.log(dataResult);
      if (dataResult) {
        if (dataResult.data.code === 500) {
          toast.error(dataResult.data.message);
        } else {
          toast.success(dataResult.data.message);
          navigate('/profile');
        }
      }
    } catch (error) {
      console.log('Failed to reset password: ', error);
      toast.error(error.message);
    }
  };
  return (
    <Container maxWidth="lg">
      <Formik
        initialValues={{ ...initialFormValue }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Card>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                py={4}
                spacing={2}
              >
                <Stack className={classes.resetPasswordContainer}>
                  <Typography variant="h6">Nhập mật khẩu hiện tại</Typography>
                  <TextfieldWrapper
                    name="oldPassword"
                    fullWidth
                    type={oldPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={oldPasswordShown ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                          arrow
                        >
                          <IconButton
                            onClick={() => setOldPasswordShown(!oldPasswordShown)}
                          >
                            {oldPasswordShown ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack className={classes.resetPasswordContainer}>
                  <Typography variant="h6">Nhập mật khẩu mới</Typography>
                  <TextfieldWrapper
                    name="newPassword"
                    fullWidth
                    type={newPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={newPasswordShown ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                          arrow
                        >
                          <IconButton
                            onClick={() => setNewPasswordShown(!newPasswordShown)}
                          >
                            {newPasswordShown ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack className={classes.resetPasswordContainer}>
                  <Typography variant="h6">Nhập lại mật khẩu mới</Typography>
                  <TextfieldWrapper
                    name="reNewPassword"
                    fullWidth
                    type={reNewPasswordShown ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={reNewPasswordShown ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                          arrow
                        >
                          <IconButton
                            onClick={() => setReNewPasswordShown(!reNewPasswordShown)}
                          >
                            {reNewPasswordShown ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack>
                  <Typography className={classes.noteText}>
                    Hãy đảm bảo rằng mật khẩu của bạn có chứa ít nhất 8 ký tự, trong đó có
                    phải có chữ và số.
                  </Typography>
                </Stack>
                <Stack>
                  <LoadingButton
                    variant="contained"
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<LockReset />}
                    type="submit"
                  >
                    Đổi mật khẩu
                  </LoadingButton>
                </Stack>
              </Stack>
            </Card>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ResetPassword;
