import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React from 'react';

const TooltipUnitMeasure = (props) => {
  const { quantity, wrapUnitMeasure, numberOfWrapUnitMeasure, unitMeasure, isConvert } = props;
  return (
    <Tooltip
      title={
        isConvert ?
        (quantity -
        (quantity % 1) +
        ' ' +
        wrapUnitMeasure +
        ' ' +
        Math.floor((quantity % 1) * numberOfWrapUnitMeasure) +
        ' ' +
        unitMeasure) : (1 + ' '+ wrapUnitMeasure+ ' = '+numberOfWrapUnitMeasure +' ' +unitMeasure) 
      }
    >
      <IconButton>
        <InfoOutlined />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipUnitMeasure;
