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
    cursor: 'pointer'
  }
});


const ConsignmentsTable = ({ consignments }) => {
  const dataTest = {
    id: 1,
    productCode: 'GACH23',
    productName: 'Gạch men 60x60',
    unitMeasure: 'Viên',
    quantity: 54,
    unitPrice: 100000
  }
  const formatCurrency = (value) => value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow >
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
          <TableRow
            hover
            // key={consignment.id}
            //   selected={isconsignmentselected}
            selected={false}
          >
            <TableCell>{dataTest.id}</TableCell>
            <TableCell>{dataTest.productCode}</TableCell>
            <TableCell>{dataTest.productName}</TableCell>
            <TableCell>{dataTest.unitMeasure}</TableCell>
            <TableCell>{dataTest.quantity}</TableCell>
            <TableCell>{formatCurrency(dataTest.unitPrice)}</TableCell>
            <TableCell>{formatCurrency(dataTest.quantity * dataTest.unitPrice)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ConsignmentsTable;
