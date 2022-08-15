import FormatDataUtils from '@/utils/formatData';
import { InfoOutlined } from '@mui/icons-material';
import { IconButton, Stack, Tooltip } from '@mui/material';
import React from 'react';

const TooltipUnitMeasure = (props) => {
  const {
    quantity,
    wrapUnitMeasure,
    numberOfWrapUnitMeasure,
    unitMeasure,
    isConvert,
    value,
  } = props;
  return (
    <Tooltip
      title={
        isConvert
          ? quantity -
            (quantity % 1) +
            ' ' +
            wrapUnitMeasure +
            ' ' +
            FormatDataUtils.getRoundNumber((quantity % 1) * numberOfWrapUnitMeasure) +
            ' ' +
            unitMeasure
          : 1 +
            ' ' +
            wrapUnitMeasure +
            ' = ' +
            numberOfWrapUnitMeasure +
            ' ' +
            unitMeasure
      }
    >
      <Stack
        px={1}
        justifyContent="center"
      >
        {/* <IconButton> */}
        {value ? value : <InfoOutlined />}
        {/* </IconButton> */}
      </Stack>
    </Tooltip>
  );
};

export default TooltipUnitMeasure;
