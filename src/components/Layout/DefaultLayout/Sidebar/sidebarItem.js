import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const useStyles = makeStyles({
  root: {
    '&$selected': {
      backgroundColor: 'rgba(0,88,139,0.79) !important',
      '&:hover': {
        backgroundColor: 'yellow',
      }
    },
  },
  selected: {},
  active: {
    backgroundColor: 'red'
  }
})
const SidebarItem = ({ option, openSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const classes = useStyles()
  const [openNested, setOpenNested] = useState(false);

  useEffect(() => {
    if (openSidebar === false) {
      setOpenNested(false);
    }
  }, [openSidebar]);

  const handleClick = (option) => {
    console.log(option)
    if( option?.children.length > 0) {
      setOpenNested(!openNested);
    }else {
      navigate(option.path)
    }
    
  };

  const renderSidebarItem = (option, childOption) => {
    const { primary, icon, children, path, hasParent } = option || {};

    // child option icon is padding left and also can navigate to the page
    const childOptionStyle = childOption ? { pl: 2, color: 'white' } : {};

    const childOptionOnClick = () => {
      navigate(path);
    };

    // render child option
    if ((!children || !children.length) && hasParent) {
      return (
        <ListItemButton
          selected={location.pathname.includes(path)}
          sx={{paddingLeft: '30px'}}
          classes={{ root: classes.root, selected: classes.selected }}
          onClick={childOptionOnClick}
        >
          <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
          <ListItemText primary={primary} />
        </ListItemButton>
      );
    }

    // render parent option
    return (
      <>
        <ListItemButton
          sx={{
            minHeight: 48,
            // justifyContent: openNested ? 'initial' : 'center',
            // px: 2.5,
            color: 'white',
          }}
          classes={{ root: classes.root, selected: classes.selected }}
          selected={location.pathname.includes(path)}
          onClick={() => handleClick(option)}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 3,
              //   mr: openNested ? 3 : 'auto',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={primary}
            sx={{ color: 'White' }}
          />
          {children.length > 0 ? <>{openNested ? <ExpandLess /> : <ExpandMore />}</> : <></>}
        </ListItemButton>
        <Collapse in={openNested}>
          <Box
            component="div"
            disablePadding
          >
            {children.map((item, index) => {
              return <ListItem sx={{ padding: 0}} key={index}>{renderSidebarItem(item, true)}</ListItem>;
            })}
          </Box>
        </Collapse>
      </>
    );
  };
  return <>{renderSidebarItem(option)}</>;
};

export default SidebarItem;
