import FormatDataUtils from '@/utils/formatData';
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
import { useEffect, useState } from 'react';

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

const SubProductTable = ({ selectedUnitMeasure,product, subProductList }) => {
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
  useEffect(() => {
    
  }, [selectedUnitMeasure]);
  return (
    <Box>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Ng??y nh???p</TableCell>
              <TableCell align="center">H???n l??u kho</TableCell>
              <TableCell align="center">S??? l?????ng</TableCell>
              <TableCell align="center">Kho</TableCell>
              <TableCell align="center">?????a ch??? kho</TableCell>
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
                    {subProduct.expirationDate
                      ? formatDate(subProduct.expirationDate)
                      : 'kh??ng c??'}
                  </TableCell>
                  <TableCell align="center">
                    {selectedUnitMeasure ? (selectedUnitMeasure === product.wrapUnitMeasure
                      ? FormatDataUtils.getRoundFloorNumber(subProduct.quantity / product.numberOfWrapUnitMeasure, 2)
                      : subProduct.quantity) : subProduct.quantity}
                  </TableCell>
                  <TableCell align="center">{subProduct.wareHouseName}</TableCell>
                  <TableCell align="center">{subProduct.addressWareHouse}</TableCell>
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
