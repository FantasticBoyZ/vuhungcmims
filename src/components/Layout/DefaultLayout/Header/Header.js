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
  { url: '/dashboard', title: 'Hệ thống quản lý kho vật liệu xây dựng' },
  { url: '/product', title: 'Danh sách sản phẩm' },
  { url: '/product/detail', title: 'Thông tin sản phẩm' },
  { url: '/product/add', title: 'Thêm mới sản phẩm' },
  { url: '/product/edit', title: 'Sửa sản phẩm' },
  { url: '/category', title: 'Danh sách danh mục' },
  { url: '/category/detail', title: 'Thông tin danh mục' },
  { url: '/category/add', title: 'Thêm mới danh mục' },
  { url: '/category/edit', title: 'Sửa danh mục' },
  { url: '/manufacturer', title: 'Danh sách nhà sản xuất' },
  { url: '/manufacturer/detail', title: 'Chi tiết nhà sản xuất' },
  { url: '/manufacturer/add', title: 'Thêm mới nhà sản xuất' },
  { url: '/manufacturer/edit', title: 'Chỉnh sửa thông tin nhà sản xuất' },
  { url: '/import', title: 'Danh sách phiếu nhập kho' },
  { url: '/import/detail', title: 'Thông tin phiếu nhập kho' },
  { url: '/import/create-order', title: 'Nhập kho' },
  { url: '/import/edit', title: 'Thông tin phiếu nhập kho' },
  { url: '/export/list', title: 'Danh sách phiếu xuất kho' },
  { url: '/export/detail', title: 'Thông tin phiếu xuất kho' },
  { url: '/export/create-order', title: 'Xuất kho' },
  { url: '/export/edit', title: 'Thông tin phiếu xuất kho' },
  { url: '/export/return', title: 'Trả hàng' },
  { url: '/export/return/list', title: 'Phiếu trả hàng' },
  { url: '/export/return/detail', title: 'Thông tin phiếu trả hàng' },
  { url: '/term-inventory/return/create', title: 'Tạo phiếu lưu kho' },
  { url: '/term-inventory/return/list', title: 'Danh sách lưu kho' },
  { url: '/term-inventory/return/detail', title: 'Thông tin phiếu lưu kho' },
  { url: '/inventory-checking/create', title: 'Kiểm kho' },
  { url: '/inventory-checking/list', title: 'Lịch sử kiểm kho' },
  { url: '/inventory-checking/detail', title: 'Chi tiết kiểm kho' },
  { url: '/staff/list', title: 'Danh sách nhân viên' },
  { url: '/staff/detail', title: 'Thông tin nhân viên' },
  { url: '/staff/register', title: 'Đăng ký nhân viên mới' },
  { url: '/warehouse', title: 'Quản lý nhà kho' },
  { url: '/profile', title: 'Hồ sơ cá nhân' },
  { url: '/reset-password', title: 'Đổi mật khẩu' },
  { url: '/profile/edit', title: 'Thay đổi hồ sơ cá nhân' },
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

  return <Label padding={padding} fontSize={fontSize} color={color}>{text}</Label>;
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [fullname, setFullname] = useState('');
  const [image, setImage] = useState();
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    titles.forEach((item) => {
      if (location.pathname.includes(item.url)) {
        setTitle(item.title);
      }
    });
    const user = AuthService.getCurrentUser();
    setFullname(user.fullName);
    setRole(user.roles[0])
    if (user.imageUrl) {
      fetchImage(API_URL_IMAGE + '/' + user.imageUrl);
    }
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
            onClick={() => navigate(-1)}
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
            <Stack alignItems='flex-end'>
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
