import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: theme.spacing(3),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.primary.light,
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: '#fffbf2',
      cursor: 'pointer',
    },
  },
  cardStyle: {
    padding: '12px'
  }
}));

const SubProductTable = ({ subProductList }) => {
  const classes = useStyles();

  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [selectedSubProductList, setSelectedSubProductList] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // const selectedBulkActions = selectedSubProductList.length > 0;

  //     const handleSelectAllSubProductList = (event) => {
  //         setSelectedSubProductList(
  //           event.target.checked
  //             ? subProductList.map((subProductList) => subProductList.id)
  //             : []
  //         );
  //       };

  //       const handleSelectOnesubProductList = (event, subProductListId) => {
  //         if (!selectedSubProductList.includes(subProductListId)) {
  //           setSelectedSubProductList((prevSelected) => [
  //             ...prevSelected,
  //             subProductListId
  //           ]);
  //         } else {
  //           setSelectedSubProductList((prevSelected) =>
  //             prevSelected.filter((id) => id !== subProductListId)
  //           );
  //         }
  //       };

  //     const selectedSomeSubProductList =
  //     selectedSubProductList.length > 0 &&
  //     selectedSubProductList.length < subProductList.length;
  //   const selectedAllSubProductList =
  //     selectedSubProductList.length === subProductList.length;
  return (
    <Card className={classes.cardStyle}>
      <Typography variant='h5'>Danh sách lô hàng </Typography>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Ngày khởi tạo</TableCell>
              <TableCell>Ngày hết hạn</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Kho</TableCell>
              <TableCell>Địa chỉ kho</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subProductList.map((subProduct, index) => {
              //   const isSubProductListSelected = selectedSubProductList.includes(
              //     subProduct.id,
              //   );
              return (
                <TableRow
                  hover
                  key={index}
                  //   selected={isImportOrderSelected}
                  selected={false}
                >
                  <TableCell>{subProduct.importDate}</TableCell>
                  <TableCell>{subProduct.expirationDate}</TableCell>
                  <TableCell>{subProduct.quantity}</TableCell>
                  <TableCell>{subProduct.unitPrice}</TableCell>
                  <TableCell>{subProduct.inventoryName}</TableCell>
                  <TableCell>{subProduct.addressInventory}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {/* TODO: create table pagination */}
        </Table>
        <TablePagination
          component="div"
          page={page}
          rowsPerPageOptions={pages}
          rowsPerPage={rowsPerPage}
          count={subProductList.length}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Card>
  );
};

export default SubProductTable;
