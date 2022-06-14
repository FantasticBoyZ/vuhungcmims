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
} from '@mui/material';
import { Notifications, Warehouse } from '@mui/icons-material';
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
}));

const titles = {
  "/dashboard": "Hệ thống quản lý kho vật liệu xây dựng",
  "/product": "Danh sách sản phẩm"
};



const Header = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('')
  const navigate = useNavigate();
const location = useLocation();


  const logOut = () => {
    AuthService.logout();
    navigate('/login')
  };

  useEffect(() => {
    setTitle(titles[location.pathname])
  }, [location.pathname])
  return (
    <AppBar sx={{ backgroundColor: "white", color: 'black'}} position="sticky">
      <StyledToolbar>
        <Typography
          variant="h6"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
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
            <Typography variant="span">Admin</Typography>
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
        sx={{marginTop: '35px'}}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
