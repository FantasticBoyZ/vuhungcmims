import React, { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { ChevronRight, Home, Inbox, Info, Mail, Menu } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { privateRoutes } from '@/routes/index';
import { color } from '@mui/system';

const drawerWidth = 240;



let CustomListItem = ({ to, text, icon, open, location, link }) => (
  <ListItem
    to={to}
    component={link}
    selected={to === location.pathname}
    key={text}
    disablePadding
    sx={{ display: 'block' }}
  >
    
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? 'initial' : 'center',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : 'auto',
            justifyContent: 'center',
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{ opacity: open ? 1 : 0 , color: '#333' }}
        />
      </ListItemButton>
    
  </ListItem>
);

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
  const location = useLocation();
  const [open, setOpen] = useState(true);


  return (
    // <Box
    //   bgcolor="skyblue"
    //
    //   p={2}
    //   borderRight="10px solid rgb(230, 227, 227"
    //   minHeight="100vh"
    //   sx={{ display: { xs: 'none', sm: 'block' } }}
    // >
    <Drawer
      variant="permanent"
      flex={1}
      open={open}
    >
      <DrawerHeader>
        {open && (
          <Link to={"/"} style={{ textDecoration: 'none', color: '#333' }}>
          <Typography
            variant="h6"
            fontSize={14}
          >
            Vu Hung Company's CMIMS
          </Typography>
          </Link>
        )}
        <IconButton onClick={(e) => setOpen(!open)}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <Menu />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {privateRoutes.map((item, index) => (
          <CustomListItem
            key={item.primary}
            to={item.path}
            text={item.primary}
            icon={item.icon}
            open={open}
            location={location}
            link={Link}
          />
        ))}
      </List>
    </Drawer>
    // </Box>
  );
};

export default Sidebar;
