import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const ProgressCircleLoading = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <CircularProgress style={{ marginLeft: '50%' }} />
    </Box>
  );
};

export default ProgressCircleLoading;
