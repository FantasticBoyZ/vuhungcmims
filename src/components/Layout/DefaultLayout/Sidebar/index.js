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
  useTheme
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { ChevronRight, Home, Inbox, Info, Mail, Menu } from '@mui/icons-material';

const drawerWidth = 240;

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

const Sidebar = (props) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const { history } = props;
  const itemList = [
    {
      text: "Home",
      icon: <Home/>,
      onClick: () => history.push("/")
    },
    {
      text: "About",
      icon: <Info/>,
      onClick: () => history.push("/about")
    }
  ]

  return (
    // <Box
    //   bgcolor="skyblue"
    //   
    //   p={2}
    //   borderRight="10px solid rgb(230, 227, 227"
    //   minHeight="100vh"
    //   sx={{ display: { xs: 'none', sm: 'block' } }}
    // >
       <Drawer variant="permanent" flex={1}  open={open}>
        <DrawerHeader justifyContent='center'>
          {open && <Typography variant='h6' fontSize={14} >
          Vu Hung Company's CMIMS
          </Typography>}
          <IconButton onClick={e=>setOpen(!open)}>   
            {theme.direction === 'rtl' ? <ChevronRight /> : <Menu />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Home','Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
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
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
      </Drawer>
    // </Box>
  );
};

export default Sidebar;
