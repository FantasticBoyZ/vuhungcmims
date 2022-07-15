import React, { useState } from 'react';
import './Login.css';
import { Box, Stack } from '@mui/material';

const LayoutLogin = ({ children }) => {
  return (
    <>
      <Stack direction="row">
        <Box className="flexContainer">
          <Box
            className="flexItem"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >{children}
          </Box>

          <ul className="bg-bubbles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </Box>
      </Stack>
    </>
  );
};

export default LayoutLogin;
