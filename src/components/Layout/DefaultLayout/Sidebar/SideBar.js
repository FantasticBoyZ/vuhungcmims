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

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  paper: {
    background: 'blue',
  },
});

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
      primary: 'Tổng quan',
      icon: <Home />,
      path: '/dashboard',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Sản Phẩm',
      icon: <AutoAwesomeMosaic />,
      path: '/product',
      children: [
        {
          primary: 'Danh sách sản phẩm',
          icon: <ViewList />,
          path: '/product',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Kiểm kho',
          icon: <FactCheck />,
          path: '/product/check',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Danh mục',
      icon: <Class />,
      path: '/category',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Nhà cung cấp',
      icon: <Factory />,
      path: '/manufacturer',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Giao dịch',
      icon: <CurrencyExchange />,
      path: '/transaction',
      children: [
        {
          primary: 'Nhập kho',
          icon: <Input />,
          path: '/import',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Xuất kho',
          icon: <Output />,
          path: '/export',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Trả hàng',
          icon: <ReplyAll />,
          path: '/return-goods',
          children: [],
          hasParent: true,
        },
        {
          primary: 'Trả hàng lưu kho',
          icon: <Loop />,
          path: '/return-to-manufacturer',
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Khách hàng',
      icon: <CameraFront />,
      path: '/customer',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Nhân viên',
      icon: <Person />,
      path: '/staff',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Sổ quỹ',
      icon: <LocalAtm />,
      path: '/cash-book',
      children: [],
      hasParent: false,
    },
    {
      primary: 'Báo cáo',
      icon: <StackedBarChart />,
      path: '/report',
      children: [],
      hasParent: false,
    },
  ];

  return (
    <Drawer
      // classes={{ paper: classes.paper }}
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
