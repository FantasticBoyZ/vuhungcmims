import React, { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  List,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import {
  AutoAwesomeMosaic,
  CameraFront,
  Category,
  ChevronRight,
  Class,
  CurrencyExchange,
  FactCheck,
  Factory,
  Home,
  Input,
  LocalAtm,
  Loop,
  Menu,
  Output,
  Person,
  ReplyAll,
  StackedBarChart,
  TableView,
  TurnLeft,
  ViewList,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import SidebarItem from './sidebarItem';
import { makeStyles } from '@mui/styles';

const drawerWidth = 250;

// let CustomListItem = ({ item, location, open, link }) => (
//   <ListItem
//     to={item.path}
//     component={link}
//     selected={item.path === location.pathname}
//     key={item.text}
//     disablePadding
//     sx={{ display: 'block' }}
//   >
//     <ListItemButton
//       sx={{
//         minHeight: 48,
//         justifyContent: open ? 'initial' : 'center',
//         px: 2.5,
//       }}
//     >
//       <ListItemIcon
//         sx={{
//           minWidth: 0,
//           mr: open ? 3 : 'auto',
//           justifyContent: 'center',
//         }}
//       >
//         {item.icon}
//       </ListItemIcon>
//       <ListItemText
//         primary={item.primary}
//         sx={{ opacity: open ? 1 : 0, color: '#333' }}
//       />
//     </ListItemButton>
//   </ListItem>
// );

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  paper: {
    background: 'blue',
  },
  drawerPaper: {
    width: 250,
    // overflow: "auto",
    height: "100%",
    [theme.breakpoints.up("md")]: {
      overflow: "auto",
      width: drawerWidth,
      position: "relative",
      height: "100%"
    }
  }
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor: 'red',
    overflow: "auto",
    height: "100%",
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Sidebar = () => {
  const theme = useTheme();
  const classes = useStyles();

  const [open, setOpen] = useState(true);

  const LIST_ITEM_SIDEBAR = [
    {
      primary: 'Trang chủ',
      icon: <Home />,
      path: '/dashboard',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Quản lý kho hàng',
      icon: <AutoAwesomeMosaic />,
      path: '/warehourse-management',
      children: [
        {
          primary: 'Sản phẩm',
          icon: '',
          path: '/product',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Nhà sản xuất',
          icon: '',
          path: '/manufacturer',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh mục',
          icon: '',
          path: '/category',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Nhà kho',
          icon: '',
          path: '/warehourse',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Quản lý nhập hàng',
      icon: <Input />,
      path: '/import-order',
      children: [
        {
          primary: 'Tạo phiếu nhập hàng',
          icon: '',
          path: '/import/create-order',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh sách nhập hàng',
          icon: '',
          path: '/import/list',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Quản lý xuất hàng',
      icon: <Output />,
      path: '/export-order',
      children: [
        {
          primary: 'Tạo phiếu xuất hàng',
          icon: '',
          path: '/export/create-order',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh sách xuất hàng',
          icon: '',
          path: '/export/list',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh sách trả hàng',
          icon: '',
          path: '/export/return/list',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Trả hàng lưu kho',
      icon: <TurnLeft />,
      path: '/transaction',
      children: [
        {
          primary: 'Tạo phiếu lưu kho',
          icon: '',
          path: '/storage/create',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh sách lưu kho',
          icon: '',
          path: '/storage/list',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Kiểm hàng',
      icon: <TableView />,
      path: '/customer',
      children: [
        {
          primary: 'Tạo phiếu kiểm hàng',
          icon: '',
          path: '/inventory-checking/create',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Lịch sử kiểm hàng',
          icon: '',
          path: '/inventory-checking/list',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Nhân viên',
      icon: <Person />,
      path: '/staff-management',
      children: [
        {
          primary: 'Đăng ký nhân viên mới',
          icon: '',
          path: '/staff/register',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh sách nhân viên',
          icon: '',
          path: '/staff/list',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
  ];

  return (
    <Drawer
      classes={{ paper: classes.drawerPaper }}
      variant="permanent"
      flex={1}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.sidebar.main,
          color: theme.palette.common.white,
        }
      }}
    >
      <DrawerHeader>
        {open && (
          <Link
            to={'/'}
            style={{ textDecoration: 'none', color: '#333' }}
          >
            <Typography
              variant="h6"
              fontSize={14}
              sx={{color: 'white'}}
            >
              Vu Hung Company's CMIMS
            </Typography>
          </Link>
        )}
        <IconButton sx={{color: 'white'}} onClick={(e) => setOpen(!open)}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <Menu />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {LIST_ITEM_SIDEBAR.map((item, index) => {
          // <CustomListItem
          //   key={item.primary}
          //   item={item}
          //   open={open}
          //   location={location}
          //   link={Link}
          // />
          return (
            <Box key={index}>
              <SidebarItem option={item} openSidebar={open} />
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
