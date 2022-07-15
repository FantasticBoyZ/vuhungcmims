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
} from '@mui/material';
import { ArrowBackIosNew, Notifications, Warehouse } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import AuthService from '@/services/authService';
import { useLocation, useNavigate } from 'react-router-dom';

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
  cursor: 'pointer'
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
  { url: '/export', title: 'Danh sách phiếu xuất kho' },
  { url: '/export/detail', title: 'Thông tin phiếu xuất kho' },
  { url: '/export/create-order', title: 'Xuất kho' },
  { url: '/export/edit', title: 'Thông tin phiếu xuất kho' },
  { url: '/warehouse', title: 'Quản lý nhà kho' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('')
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    AuthService.logout();
    navigate('/login');
  };

  useEffect(() => {
    titles.forEach((item) => {
      if (location.pathname.includes(item.url)) {
        setTitle(item.title);
      }
    });
    const user = AuthService.getCurrentUser()
    setUsername(user.username)
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
          <Badge
            badgeContent={4}
            color="error"
          >
            <Notifications />
          </Badge>
          <UserBox onClick={(e) => setOpen(true)}>
            <Avatar
              sx={{ width: 30, height: 30 }}
              src="https://www.w3schools.com/w3images/avatar2.png"
            />
            <Typography variant="span">{username}</Typography>
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
        sx={{ marginTop: '35px' }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
