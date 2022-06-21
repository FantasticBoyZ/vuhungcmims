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

const useStyles = makeStyles({
  failed: {
    color: 'error',
  },
  completed: {
    color: 'success',
  },
  pending: {
    color: 'warning',
  },
  tableRow: {
    cursor: 'pointer',
  },
});

const ConsignmentsTable = ({ listConsignments }) => {
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Đơn vị tính</TableCell>
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
              <TableCell>{index}</TableCell>
              <TableCell>{consignment?.productCode}</TableCell>
              <TableCell>{consignment?.productName}</TableCell>
              <TableCell>{consignment?.unitMeasure}</TableCell>
              <TableCell>{consignment?.quantity}</TableCell>
              <TableCell>{formatCurrency(consignment?.price || '')}</TableCell>
              <TableCell>
                {formatCurrency(consignment?.quantity * consignment?.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConsignmentsTable;
