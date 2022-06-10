import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ option }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNested, setOpenNested] = useState(false);

  const handleClick = () => {
    setOpenNested(!openNested);
  };

  const renderSidebarItem = (option, childOption) => {
    const { primary, icon, children, path } = option || {};

    // child option icon is padding left and also can navigate to the page
    const childOptionStyle = childOption ? { pl: 2, color: 'white' } : {};

    const childOptionOnClick = () => {
      navigate(path);
    };

    // render child option
    if (!children || !children.length) {
      return (
        <ListItemButton
        selected={path === location.pathname}
          sx={childOptionStyle}
          onClick={childOptionOnClick}
        >
          <ListItemIcon sx={{color: 'white'}}>{icon}</ListItemIcon>
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
            px: 2.5,
            color: 'white',
          }}
          selected={path === location.pathname}
          onClick={handleClick}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: 3,
            //   mr: openNested ? 3 : 'auto',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={primary}
            sx={{ color: 'White' }}
          />
          {openNested ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openNested}>
          <Box
            component="div"
            disablePadding
          >
            {children.map((item,index) => {
              return <ListItem key={index}>{renderSidebarItem(item, true)}</ListItem>;
            })}
          </Box>
        </Collapse>
      </>
    );
  };
  return <>{renderSidebarItem(option)}</>;
};

export default SidebarItem;
