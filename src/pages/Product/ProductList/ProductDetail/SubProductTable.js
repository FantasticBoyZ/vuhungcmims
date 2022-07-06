import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody td': {},
    '& tbody tr:hover': {
      // cursor: 'pointer',
    },
  },
}));

const SubProductTable = ({ subProductList }) => {
  const classes = useStyles();

  const [selectedSubProductList, setSelectedSubProductList] = useState([]);

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
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
    <Box>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ngày nhập</TableCell>
              <TableCell align="center">Hạn lưu kho</TableCell>
              <TableCell align="center">Số lượng</TableCell>
              <TableCell align="center">Kho</TableCell>
              <TableCell align="center">Địa chỉ kho</TableCell>
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
                  <TableCell align="center">
                    {formatDate(subProduct.importDate)}
                  </TableCell>
                  <TableCell align="center">
                    {formatDate(subProduct.expirationDate)}
                  </TableCell>
                  <TableCell align="center">{subProduct.quantity}</TableCell>
                  <TableCell align="center">{subProduct.inventoryName}</TableCell>
                  <TableCell align="center">{subProduct.addressInventory}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubProductTable;
