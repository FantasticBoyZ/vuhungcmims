import { DeleteTwoTone, EditTwoTone } from '@mui/icons-material';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
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


const ImportOrdersTable = ({ importOrders }) => {
  const [selectedImportOrders, setSelectedImportOrders] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const selectedBulkActions = selectedImportOrders.length > 0;
  const navigate = useNavigate();
  const selectedSomeImportOrders =
    selectedImportOrders.length > 0 && selectedImportOrders.length < importOrders.length;
  const selectedAllImportOrders = selectedImportOrders.length === importOrders.length;

  const statusOptions = [
    {
      id: 'pending',
      name: 'Đang chờ xử lý',
    },
    {
      id: 'completed',
      name: 'Đã nhập kho',
    },
    {
      id: 'canceled',
      name: 'Đã hủy',
    },
  ];
  const handleOnClickTableRow = (id) => {
    navigate(`/import/detail/${id}`);
  }
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllImportOrders}
                  indeterminate={selectedSomeImportOrders}
                />
              </TableCell>
              <TableCell>Mã nhập kho</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Nhà cung cấp</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {importOrders.map((importOrder) => {
              // TODO: làm selectedImportOrders
              //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
              return (
                <TableRow
                  hover
                  key={importOrder.id}
                  className={classes.tableRow}
                  //   selected={isImportOrderSelected}
                  selected={false}
                  onClick={(value) => handleOnClickTableRow(importOrder.id)}
                >
                  <TableCell padding="checkbox">
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
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {/* lấy tạm id làm MÃ SỐ HÓA ĐƠN, sau này có cái này trong api thì thay  */}
                      {importOrder.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {format(importOrder.createDate, 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {importOrder.manufactorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {/* TODO: style status  */}
                    <Typography className={classes.completed}>
                      {importOrder.statusName}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default ImportOrdersTable;
