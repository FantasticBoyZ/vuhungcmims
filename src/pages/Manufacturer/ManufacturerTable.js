import { Edit, EditTwoTone, Info, InfoTwoTone } from '@mui/icons-material';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  table: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
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
  cardStyle: {
    padding: '12px',
  },
}));

const ManufacturerTable = ({ manufacturerList }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleOnClickDetailManufacturer = (manufacturerId) => {
    console.log(manufacturerId);
    navigate(`/manufacturer/detail/${manufacturerId}`);
  };

  const handleOnClickEditCategory = (manufacturerId) => {
    navigate(`/manufacturer/edit/${manufacturerId}`);
  };

  return (
    <TableContainer>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            {/* <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={selectedAllImportOrders}
                indeterminate={selectedSomeImportOrders}
              />
            </TableCell> */}
            <TableCell>Tên nhà cung cấp</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Địa chỉ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {manufacturerList.map((manufacturer) => {
            // TODO: làm selectedImportOrders
            //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
            return (
              <TableRow
                onClick={() => handleOnClickDetailManufacturer(manufacturer.id)}
                hover
                key={manufacturer.id}
                //   selected={isImportOrderSelected}
                selected={false}
                // onClick={(value) => handleOnClickTableRow(importOrder.orderId)}
              >
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    //   checked={isImportOrderSelected}
                    checked={false}
                    // TODO: create function handle onclick checkbox
                    //   onChange={(event) =>
                    //     handleSelectOneImportOrder(event, importOrder.id)
                    //   }

                    //   value={isImportOrderSelected}
                    value={false}
                  />
                </TableCell> */}
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {manufacturer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {manufacturer.phone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {manufacturer.email}
                  </Typography>
                </TableCell>
                <TableCell align="center">{manufacturer.manufactureAddress}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ManufacturerTable;
