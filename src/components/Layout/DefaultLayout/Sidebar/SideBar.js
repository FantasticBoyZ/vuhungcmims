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
import AuthService from '@/services/authService';

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
    height: '100%',
    [theme.breakpoints.up('md')]: {
      overflow: 'auto',
      width: drawerWidth,
      position: 'relative',
      height: '100%',
    },
  },
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
    overflow: 'auto',
    height: '100%',
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
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  const [open, setOpen] = useState(true);

  const LIST_ITEM_SIDEBAR = [
    {
      primary: 'Trang ch???',
      icon: <Home />,
      path: '/dashboard',
      children: [],
      hasParent: false,
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      primary: 'Qu???n l?? kho h??ng',
      icon: <AutoAwesomeMosaic />,
      path: '/warehourse-management',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
      children: [
        {
          primary: 'S???n ph???m',
          icon: '',
          path: '/product',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Nh?? s???n xu???t',
          icon: '',
          path: '/manufacturer',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh m???c',
          icon: '',
          path: '/category',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Nh?? kho',
          icon: '',
          path: '/warehouse',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Qu???n l?? nh???p h??ng',
      icon: <Input />,
      path: '/import-order',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
      children: [
        {
          primary: 'T???o phi???u nh???p h??ng',
          icon: '',
          path: '/import/create-order',
          acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh s??ch nh???p h??ng',
          icon: '',
          path: '/import/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Qu???n l?? xu???t h??ng',
      icon: <Output />,
      path: '/export-order',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
      children: [
        {
          primary: 'T???o phi???u xu???t h??ng',
          icon: '',
          path: '/export/create-order',
          acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh s??ch xu???t h??ng',
          icon: '',
          path: '/export/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh s??ch tr??? h??ng',
          icon: '',
          path: '/export/return/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Tr??? h??ng l??u kho',
      icon: <TurnLeft />,
      path: '/transaction',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
      children: [
        {
          primary: 'T???o phi???u l??u kho',
          icon: '',
          path: '/term-inventory/return/create',
          acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh s??ch l??u kho',
          icon: '',
          path: '/term-inventory/return/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Ki???m kho',
      icon: <TableView />,
      path: '/customer',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER'],
      children: [
        {
          primary: 'T???o phi???u ki???m kho',
          icon: '',
          path: '/inventory-checking/create',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'L???ch s??? ki???m kho',
          icon: '',
          path: '/inventory-checking/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
      ],
      hasParent: false,
    },
    {
      primary: 'Nh??n vi??n',
      icon: <Person />,
      path: '/staff-management',
      acceptRole: ['ROLE_OWNER'],
      children: [
        {
          primary: '????ng k?? nh??n vi??n m???i',
          icon: '',
          path: '/staff/register',
          acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
          children: [],
          hasParent: true,
        },
        {
          primary: 'Danh s??ch nh??n vi??n',
          icon: '',
          path: '/staff/list',
          acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
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
        },
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
              fontSize={24}
              sx={{ color: 'white' }}
              
            >
              V?? H??ng CMIMS
            </Typography>
          </Link>
        )}
        <IconButton
          sx={{ color: 'white' }}
          onClick={(e) => setOpen(!open)}
        >
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
              {item.acceptRole.includes(currentUserRole) && (
                <SidebarItem
                  option={item}
                  openSidebar={open}
                />
              )}
            </Box>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
