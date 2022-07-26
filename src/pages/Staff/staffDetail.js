import AlertPopup from '@/components/Common/AlertPopup';
import Label from '@/components/Common/Label';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import {
  getStaffDetail,
  resetPassword,
  setActiveForStaff,
  updateImageStaff,
  updateRoleForStaff,
} from '@/slices/StaffSlice';
import FormatDataUtils from '@/utils/formatData';
import {
  Block,
  ChangeCircleOutlined,
  LockOpen,
  MarkEmailUnread,
  PhotoCamera,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  imgContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'wrap',
  },
  imgProfile: {
    width: '100%',
    aspectRatio: '1/1',
  },
  labelStyle: {
    backgroundColor: theme.colors.alpha.black[5],
    padding: theme.spacing(0.5, 1),
    fontSize: theme.typography.pxToRem(20),
    borderRadius: theme.general.borderRadius,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.lighter,
    color: theme.palette.primary.main,
    // maxHeight: theme.spacing(3)
  },
}));

const getRoleLabel = (exportOrderStatus) => {
  const map = {
    ROLE_STOREKEEPER: {
      text: 'Thủ kho',
      color: 'warning',
      fontSize: '20px',
    },
    ROLE_SELLER: {
      text: 'Nhân viên bán hàng',
      color: 'primary',
      fontSize: '20px',
    },
    ROLE_OWNER: {
      text: 'Chủ cửa hàng',
      color: 'error',
      fontSize: '20px',
    },
  };

  const { text, color, fontSize } = map[exportOrderStatus];

  return (
    <Label
      color={color}
      fontSize={fontSize}
    >
      {text}
    </Label>
  );
};

const getStatusLabel = (exportOrderStatus) => {
  const map = {
    true: {
      text: 'Đang hoạt động',
      color: 'success',
      fontSize: '20px',
    },
    false: {
      text: 'Đã ngưng hoạt động',
      color: 'error',
      fontSize: '20px',
    },
  };

  const { text, color, fontSize } = map[exportOrderStatus];

  return (
    <Label
      fontSize={fontSize}
      color={color}
    >
      {text}
    </Label>
  );
};

const localhost = 'http://localhost:8080';
const deployUrl = 'http://ec2-52-221-240-240.ap-southeast-1.compute.amazonaws.com:8080';

const StaffDetail = () => {
  const { staffId } = useParams();
  const classes = useStyles();
  const [staff, setStaff] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [confirmTask, setConfirmTask] = useState();
  const [image, setImage] = useState();
  const hiddenFileInput = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.staff }));

  const { initialFormValue, setInitialFormValue } = useState({
    // name: category?.name || '',
    username: '',
    role: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleUpdateImage = () => {
    console.log('cập nhật ảnh đại diện');
    hiddenFileInput.current.click();
  };

  const handleChangeImageStaff = async (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      setTitle('Chú ý');
      setMessage('');
      setErrorMessage('Vui lòng chọn file ảnh có định dạng .png hoặc .jpg');
      setOpenPopup(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTitle('Chú ý');
      setMessage('');
      setErrorMessage('Vui lòng chọn file có dung lượng nhỏ hơn 5MB');
      setOpenPopup(true);
      return;
    }

    setImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    try {
      const params = {
        staffId: staffId,
        formData: formData,
      };
      const actionResult = await dispatch(updateImageStaff(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult) {
        toast.success(dataResult.message);
        fetchStaffDetail();
      }
    } catch (error) {
      console.log('Failed to set active staff: ', error);
    }
  };

  const handleResetPasswordStaff = () => {
    console.log('reset mật khẩu nhân viên');
    setTitle('Thao tác này sẽ cài lại mật khẩu và gửi mật khẩu cài lại về email “'+ staff.email +'”.');
    setConfirmTask('resetPassword');
    setMessage('');
    setErrorMessage(null);
    setOpenPopup(true);
  };

  const handleSetActiveStaff = () => {
    console.log('Đổi trạng thái tài khoản');
    if (Boolean(staff.active) === true) {
      setTitle(
        'Bạn có chắc chắn muốn ngưng hoạt động của tài khoản ' +
          staff.userName +
          ' không?',
      );
    } else {
      setTitle('Bạn có chắc chắn muốn kích hoạt tài khoản ' + staff.userName + ' không?');
    }
    setConfirmTask('setActive');
    setMessage('');
    setErrorMessage(null);
    setOpenPopup(true);
  };

  const handleChangeRole = () => {
    console.log('Đổi chức vụ');
    if (staff.roleName === 'ROLE_STOREKEEPER') {
      setTitle(
        'Bạn có chắc chắn đổi chức vụ của nhân viên thành Nhân viên bán hàng không?',
      );
    } else {
      setTitle('Bạn có chắc chắn đổi chức vụ của nhân viên thành Thủ kho không?');
    }
    setConfirmTask('changeRole');
    setMessage('');
    setErrorMessage(null);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    switch (confirmTask) {
      case 'resetPassword':
        try {
          const params = {
            id: staffId,
          };
          const actionResult = await dispatch(resetPassword(params));
          const dataResult = unwrapResult(actionResult);
          console.log('dataResult', dataResult);
          if (dataResult) {
            toast.success(dataResult.data.message);
            setOpenPopup(false);
          }
        } catch (error) {
          console.log('Failed to set active staff: ', error);
        }
        break;
      case 'setActive':
        if (!!staff) {
          try {
            const params = {
              staffId: staffId,
              isActive: !staff.active,
            };
            const actionResult = await dispatch(setActiveForStaff(params));
            const dataResult = unwrapResult(actionResult);
            console.log('dataResult', dataResult);
            if (dataResult) {
              toast.success(dataResult.message);
              fetchStaffDetail();
              setOpenPopup(false);
            }
          } catch (error) {
            console.log('Failed to set active staff: ', error);
          }
        }
        break;
      case 'changeRole':
        try {
          console.log(staff.roleId);
          const params = {
            staffId: staffId,
            roleId: staff.roleId == 2 ? 3 : 2,
          };
          const actionResult = await dispatch(updateRoleForStaff(params));
          const dataResult = unwrapResult(actionResult);
          console.log('dataResult', dataResult);
          if (dataResult) {
            toast.success(dataResult.message);
            fetchStaffDetail();
            setOpenPopup(false);
          }
        } catch (error) {
          console.log('Failed to set active staff: ', error);
        }
        break;
    }
  };

  const fetchStaffDetail = async () => {
    try {
      const params = {};
      const actionResult = await dispatch(getStaffDetail(staffId));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult) {
        setStaff(dataResult.data);
        fetchImage(localhost + '/' + dataResult.data.imageUrl);
      }
    } catch (error) {
      console.log('Failed to fetch staff detail: ', error);
    }
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };

  useEffect(() => {
    fetchStaffDetail();
  }, []);

  return (
    <Box>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {staff && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={2.5}
                item
              >
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.imgContainer}>
                        <Stack spacing={2}>
                          <img
                            className={classes.imgProfile}
                            accept="image/png, image/jpeg"
                            src={
                              image
                                ? image
                                : require('@/assets/images/default-avatar.jpg')
                            }
                          />
                          <Button
                            variant="outlined"
                            startIcon={<PhotoCamera />}
                            color="warning"
                            fullWidth
                            onClick={() => handleUpdateImage()}
                          >
                            Cập nhật ảnh đại diện
                          </Button>
                          <input
                            accept="image/png, image/gif, image/jpeg"
                            style={{ display: 'none' }}
                            ref={hiddenFileInput}
                            onChange={(e) => handleChangeImageStaff(e)}
                            id="upload-file"
                            type="file"
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <Stack
                        padding={2}
                        spacing={2}
                        alignItems="center"
                      >
                        <Box>{getRoleLabel(staff.roleName)}</Box>
                        <Box>{getStatusLabel(Boolean(staff.active))}</Box>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                xs={9.5}
                item
              >
                <Card>
                  <CardHeader title="Thông tin nhân viên" />
                  <CardContent>
                    <Stack
                      padding={2}
                      spacing={2}
                    >
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Họ và tên</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.fullName}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Mã nhân viên</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.userName}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Số điện thoại</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.phone}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Email</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.email}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Số CCCD/CMND</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.identityCard}</Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Địa chỉ</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>
                            {staff.detailAddress}, {staff.wardName}, {staff.districtName},{' '}
                            {staff.provinceName}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Ngày sinh</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>
                            {FormatDataUtils.formatDate(staff.dateOfBirth)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid
                          xs={3}
                          item
                        >
                          <Typography>Giới tính</Typography>
                        </Grid>
                        <Grid
                          xs={9}
                          item
                        >
                          <Typography>{staff.gender === true ? 'Nam' : 'Nữ'}</Typography>
                        </Grid>
                      </Grid>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                      >
                        <Button
                          variant="contained"
                          startIcon={<MarkEmailUnread />}
                          onClick={() => handleResetPasswordStaff()}
                        >
                          Cài lại mật khẩu
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={!Boolean(staff.active) ? <LockOpen /> : <Block />}
                          color={!Boolean(staff.active) ? 'success' : 'error'}
                          onClick={() => handleSetActiveStaff()}
                        >
                          {!Boolean(staff.active)
                            ? 'Kích hoạt tài khoản'
                            : 'Tạm dừng tài khoản'}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<ChangeCircleOutlined />}
                          color="warning"
                          onClick={() => handleChangeRole()}
                        >
                          Đổi chức vụ
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <AlertPopup
                maxWidth="sm"
                title={errorMessage ? 'Chú ý' : title}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                isConfirm={!errorMessage}
                handleConfirm={handleConfirm}
              >
                <Box
                  component={'span'}
                  className="popupMessageContainer"
                >
                  {errorMessage ? errorMessage : message}
                </Box>
              </AlertPopup>
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default StaffDetail;
