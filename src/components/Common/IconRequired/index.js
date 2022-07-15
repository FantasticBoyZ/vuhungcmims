import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
const useStyles = makeStyles(() => ({
  iconRequired: {
    color: 'red',
    paddingLeft: '3px'
  },
}));
const IconRequired = () => {
  const classes = useStyles();
  return (
    <Tooltip
      title="Bắt buộc"
      arrow
    >
      <span className={classes.iconRequired}>*</span>
    </Tooltip>
  );
};

export default IconRequired;
