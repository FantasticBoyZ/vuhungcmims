import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import { ArrowBackIosNew, Notifications, Warehouse } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import AuthService from '@/services/authService';
import { useLocation, useNavigate } from 'react-router-dom';
import Label from '@/components/Common/Label';
import { API_URL_IMAGE } from '@/constants/apiUrl';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Icons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px',
  alignItems: 'center',
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  cursor: 'pointer',
}));

const titles = [
  { url: '/dashboard', title: 'Hệ thống quản lý kho vật liệu xây dựng', backUrl: null },
  { url: '/product', title: 'Danh sách sản phẩm', backUrl: null },
  { url: '/product/detail', title: 'Thông tin sản phẩm', backUrl: '/product' },
  { url: '/product/add', title: 'Thêm mới sản phẩm', backUrl: null },
  { url: '/product/edit', title: 'Sửa sản phẩm', backUrl: null },
  { url: '/category', title: 'Danh sách danh mục', backUrl: null },
  { url: '/category/detail', title: 'Thông tin danh mục', backUrl: '/category' },
  { url: '/category/add', title: 'Thêm mới danh mục', backUrl: '/category' },
  { url: '/category/edit', title: 'Sửa danh mục', backUrl: null },
  { url: '/manufacturer', title: 'Danh sách nhà sản xuất', backUrl: null },
  { url: '/manufacturer/detail', title: 'Chi tiết nhà sản xuất', backUrl: '/manufacturer' },
  { url: '/manufacturer/add', title: 'Thêm mới nhà sản xuất', backUrl: null },
  { url: '/manufacturer/edit', title: 'Chỉnh sửa thông tin nhà sản xuất', backUrl: null },
  { url: '/import/list', title: 'Danh sách phiếu nhập kho', backUrl: null },
  { url: '/import/detail', title: 'Thông tin phiếu nhập kho', backUrl: '/import/list' },
  { url: '/import/create-order', title: 'Nhập kho', backUrl: null },
  { url: '/import/edit', title: 'Thông tin phiếu nhập kho', backUrl: null },
  { url: '/export/list', title: 'Danh sách phiếu xuất kho', backUrl: null },
  { url: '/export/detail', title: 'Thông tin phiếu xuất kho', backUrl: '/export/list' },
  { url: '/export/create-order', title: 'Xuất kho', backUrl: null },
  { url: '/export/edit', title: 'Thông tin phiếu xuất kho', backUrl: null },
  { url: '/export/return', title: 'Trả hàng', backUrl: null },
  { url: '/export/return/list', title: 'Phiếu trả hàng', backUrl: null },
  { url: '/export/return/detail', title: 'Thông tin phiếu trả hàng', backUrl: null },
  { url: '/term-inventory/return/create', title: 'Tạo phiếu lưu kho', backUrl: null },
  { url: '/term-inventory/return/list', title: 'Danh sách lưu kho', backUrl: null },
  { url: '/term-inventory/return/detail', title: 'Thông tin phiếu lưu kho', backUrl: '/term-inventory/return/list' },
  { url: '/term-inventory/return/edit', title: 'Thông tin phiếu lưu kho', backUrl: null },
  { url: '/inventory-checking/create', title: 'Kiểm kho', backUrl: null },
  { url: '/inventory-checking/list', title: 'Lịch sử kiểm kho', backUrl: null },
  { url: '/inventory-checking/detail', title: 'Chi tiết kiểm kho', backUrl: null },
  { url: '/staff/list', title: 'Danh sách nhân viên', backUrl: null },
  { url: '/staff/detail', title: 'Thông tin nhân viên', backUrl: null },
  { url: '/staff/register', title: 'Đăng ký nhân viên mới', backUrl: null },
  { url: '/warehouse', title: 'Quản lý nhà kho' , backUrl: null},
  { url: '/profile', title: 'Hồ sơ cá nhân', backUrl: null },
  { url: '/reset-password', title: 'Đổi mật khẩu', backUrl: null },
  { url: '/profile/edit', title: 'Thay đổi hồ sơ cá nhân', backUrl: null },
];

const getRoleLabel = (exportOrderStatus) => {
  const map = {
    ROLE_STOREKEEPER: {
      text: 'Thủ kho',
      color: 'warning',
      fontSize: '12px',
      padding: '2px 4px',
    },
    ROLE_SELLER: {
      text: 'Nhân viên bán hàng',
      color: 'primary',
      fontSize: '12px',
      padding: '2px 4px',
    },
    ROLE_OWNER: {
      text: 'Chủ cửa hàng',
      color: 'error',
      fontSize: '12px',
      padding: '2px 4px',
    },
  };

  const { text, color, fontSize, padding } = map[exportOrderStatus];

  return (
    <Label
      padding={padding}
      fontSize={fontSize}
      color={color}
    >
      {text}
    </Label>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [fullname, setFullname] = useState('');
  const [backUrl, setBackUrl] = useState(null)
  const [image, setImage] = useState();
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  const logOut = () => {
    AuthService.logout();
    navigate('/login');
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };

  useEffect(() => {
    if (user.imageUrl) {
      fetchImage(API_URL_IMAGE + '/' + user.imageUrl);
    }
  }, []);

  useEffect(() => {
    titles.forEach((item) => {
      if (location.pathname.includes(item.url)) {
        setTitle(item.title);
        setBackUrl(item.backUrl)
      }
    });

    setFullname(user.fullName);
    setRole(user.roles[0]);
  }, [location.pathname]);
  return (
    <AppBar
      sx={{ backgroundColor: 'white', color: 'black' }}
      position="sticky"
    >
      <StyledToolbar>
        <Typography
          variant="h6"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          <IconButton
            variant="text"
            color="inherit"
            onClick={() => navigate(!backUrl ? -1 : backUrl)}
          >
            <ArrowBackIosNew />
          </IconButton>
          {title}
        </Typography>
        <Warehouse sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Icons>
          {/* <Badge
            badgeContent={4}
            color="error"
          >
            <Notifications />
          </Badge> */}
          <UserBox onClick={(e) => setOpen(true)}>
            <Stack alignItems="flex-end">
              <Typography variant="h5">{fullname}</Typography>
              {role && getRoleLabel(role)}
            </Stack>
            <Avatar
              sx={{ width: 45, height: 45 }}
              src={image ? image : require('@/assets/images/default-avatar.jpg')}
            />
          </UserBox>
        </Icons>
      </StyledToolbar>
      <Menu
        id="basic-menu"
        open={open}
        onClose={(e) => setOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ marginTop: '38px' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>Hồ sơ cá nhân</MenuItem>
        <MenuItem onClick={logOut}>Đăng xuất</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
