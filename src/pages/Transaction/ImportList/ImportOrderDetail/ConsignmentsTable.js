import FormatDataUtils from '@/utils/formatData';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody tr:hover': {
      // cursor: 'pointer',
    },
  },
}));

const ConsignmentsTable = ({ listConsignments }) => {
  const classes = useStyles();
  const dataTest = {
    id: 1,
    productCode: 'GACH23',
    productName: 'Gạch men 60x60',
    unitMeasure: 'Viên',
    quantity: 54,
    unitPrice: 100000,
  };
  const formatCurrency = (value) =>
    value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Hạn lưu kho</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell>Số lượng</TableCell>
            <TableCell>Đơn giá</TableCell>
            <TableCell>Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listConsignments.map((consignment, index) => (
            <TableRow
              hover
              key={index}
              //   selected={islistConsignmentselected}
              selected={false}
            >
              {/* TODO: Sửa phần index khi phân trang */}
              <TableCell>{index + 1}</TableCell>
              <TableCell>{consignment?.productCode}</TableCell>
              <TableCell>{consignment?.productName}</TableCell>
              <TableCell>
                {FormatDataUtils.formatDate(consignment?.expirationDate)}
              </TableCell>
              <TableCell
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {consignment.wrapUnitMeasure == null ? (
                  consignment.unitMeasure
                ) : (
                  <Select
                    classNamePrefix="select"
                    defaultValue={
                      FormatDataUtils.getOption([
                        {
                          number: 1,
                          name: consignment.unitMeasure,
                        },
                        {
                          number: consignment.numberOfWrapUnitMeasure,
                          name: consignment.wrapUnitMeasure,
                        },
                      ])[0]
                    }
                    options={FormatDataUtils.getOption([
                      {
                        number: 1,
                        name: consignment.unitMeasure,
                      },
                      {
                        number: consignment.numberOfWrapUnitMeasure,
                        name: consignment.wrapUnitMeasure,
                      },
                    ])}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    onChange={(e) => {
                      console.log(e.value.number);
                      // if (e.value.number === consignment.numberOfWrapUnitMeasure) {
                      //   productQuantity = productQuantity / e.value.number;
                      // } else {
                      //   productQuantity = consignment.quantity;
                      // }
                      // console.log(productQuantity);
                    }}
                  />
                )}
              </TableCell>
              <TableCell>{consignment?.quantity}</TableCell>
              <TableCell>{formatCurrency(consignment?.unitPrice || 0)}</TableCell>
              <TableCell>
                {formatCurrency(consignment?.quantity * consignment?.unitPrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConsignmentsTable;
