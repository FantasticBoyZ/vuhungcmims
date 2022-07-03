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
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    // padding: theme.spacing(2),
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: '#DCF4FC',
    },
    '& tbody td': {
      // fontWeight: '300',
    },
    '& tbody tr:hover': {
      // backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
  rowConsignment: {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    boxShadow: '15px',
  },
  tableCellConsignment: {
    padding: '0 !important',
  },
  tableCosignment: {
    // marginTop: '0',
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
    },
  },
}));


const ExportProductTable = ({productList}) => {
  const classes = useStyles();
  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã sản phẩm</TableCell>
            <TableCell>Tên sản phẩm</TableCell>
            <TableCell>Đơn vị</TableCell>
            <TableCell align='center'>Số lượng</TableCell>
            <TableCell align='center'>Đơn giá</TableCell>
            <TableCell align='center'>Thành tiền</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productList.map((product, index) => (
            <Fragment key={index}>
              <TableRow
                hover
                //   selected={islistProductselected}
                selected={false}
              >
                {/* TODO: Sửa phần index khi phân trang */}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product?.productCode}</TableCell>
                <TableCell>{product?.productName}</TableCell>
                <TableCell>{product?.unitMeasure}</TableCell>
                <TableCell align='center'>{product?.quantity}</TableCell>
                <TableCell align='center'>
                  {FormatDataUtils.formatCurrency(product?.unitPrice || '0')}
                </TableCell>
                <TableCell align='center'>
                  {FormatDataUtils.formatCurrency(product?.quantity * product?.unitPrice)}
                </TableCell>
              </TableRow>
              <TableRow className={classes.rowConsignment}>
                <TableCell className={classes.tableCellConsignment}></TableCell>
                <TableCell
                  colSpan={5}
                  className={classes.tableCellConsignment}
                >
                  <Table className={classes.tableCosignment}>
                    {/* <TableHead> */}
                      <TableRow>
                        <TableCell>Vị trí</TableCell>
                        <TableCell>Ngày nhập</TableCell>
                        <TableCell>Hạn lưu kho</TableCell>
                        <TableCell align='center'>Số lượng</TableCell>
                      </TableRow>
                    {/* </TableHead> */}
                    <TableBody>
                      {product?.consignments.map((consignment, indexConsignment) => (
                        <TableRow
                          key={indexConsignment}
                          hover
                        >
                          <TableCell>{consignment?.warehourseName}</TableCell>
                          <TableCell>{consignment?.importDate}</TableCell>
                          <TableCell>{consignment?.expirationDate}</TableCell>
                          <TableCell align='center'>{consignment?.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
                <TableCell className={classes.tableCellConsignment}></TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExportProductTable;
