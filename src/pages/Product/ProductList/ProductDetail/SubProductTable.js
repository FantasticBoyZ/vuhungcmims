import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TableRow,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import { useState } from 'react';

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
    // '& tbody tr:hover': {
    //   backgroundColor: '#fffbf2',
    //   cursor: 'pointer',
    // },
  },
  cardStyle: {
    padding: '12px'
  }
}));

const SubProductTable = ({ subProductList }) => {
  const classes = useStyles();

  const [selectedSubProductList, setSelectedSubProductList] = useState([]);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

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
              <TableCell align='center'>Ngày khởi tạo</TableCell>
              <TableCell align='center'>Ngày hết hạn</TableCell>
              <TableCell align='center'>Số lượng</TableCell>
              <TableCell align='center'>Đơn giá</TableCell>
              <TableCell align='center'>Kho</TableCell>
              <TableCell align='center'>Địa chỉ kho</TableCell>
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
                  <TableCell align='center'>{formatDate(subProduct.importDate)}</TableCell>
                  <TableCell align='center'>{formatDate(subProduct.expirationDate)}</TableCell>
                  <TableCell align='center'>{subProduct.quantity}</TableCell>
                  <TableCell align='center'>{subProduct.unitPrice}</TableCell>
                  <TableCell align='center'>{subProduct.inventoryName}</TableCell>
                  <TableCell align='center'>{subProduct.addressInventory}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </TableContainer>
    </Card>
  );
};

export default SubProductTable;
