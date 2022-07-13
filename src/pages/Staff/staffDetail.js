import Label from '@/components/Common/Label';
import { Block, ChangeCircleOutlined, MarkEmailUnread, PhotoCamera } from '@mui/icons-material';
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const StaffDetail = ({ staff }) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const { initialFormValue, setInitialFormValue } = useState({
    // name: category?.name || '',
    username: '',
    role: '',
    phone: '',
    email: '',
    address: '',
  });

  const getRoleLabel = (exportOrderStatus) => {
    const map = {
      storekeeper: {
        text: 'Thủ kho',
        color: 'warning',
        fontSize: '20px',
      },
      seller: {
        text: 'Nhân viên bán hàng',
        color: 'primary',
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
      active: {
        text: 'Đang hoạt động',
        color: 'success',
        fontSize: '20px',
      },
      deactive: {
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

  const handleOnClickEdit = () => {
    navigate(`/staff/edit/${staff.id}`);
  };
  return (
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
                    src="https://www.w3schools.com/howto/img_avatar.png"
                  />
                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    color="warning"
                    fullWidth
                  >
                    Cập nhật ảnh đại diện
                  </Button>
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
                <Box>{getRoleLabel('seller')}</Box>
                <Box>{getStatusLabel('active')}</Box>
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
                  <Typography>Trịnh Bá Minh Ninh</Typography>
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
                  <Typography>ninhtbm</Typography>
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
                  <Typography>+84 203 384 0560</Typography>
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
                  <Typography>ninhtbmhe141325@fpt.edu.vn</Typography>
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
                  <Typography>002100023440</Typography>
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
                  <Typography>Tổ 4, khu Tân Xuân, Xuân Mai, Chương Mỹ, Hà Nội</Typography>
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
                  <Typography>31/07/2000</Typography>
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
                  <Typography>Nam</Typography>
                </Grid>
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                justifyContent='flex-end'
              >
                <Button
                  variant="contained"
                  startIcon={<MarkEmailUnread />}
                >
                  Cài lại mật khẩu
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Block />}
                  color='error'
                >
                  Tạm dừng tài khoản
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ChangeCircleOutlined />}
                  color='warning'
                >
                  Đổi chức vụ
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StaffDetail;
