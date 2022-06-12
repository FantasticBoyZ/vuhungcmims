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
});

const ImportOrdersTable = ({ importOrders }) => {
  const [selectedImportOrders, setSelectedImportOrders] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const selectedBulkActions = selectedImportOrders.length > 0;

  const selectedSomeImportOrders =
    selectedImportOrders.length > 0 && selectedImportOrders.length < importOrders.length;
  const selectedAllImportOrders = selectedImportOrders.length === importOrders.length;

  const statusOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'completed',
      name: 'Completed',
    },
    {
      id: 'pending',
      name: 'Pending',
    },
    {
      id: 'failed',
      name: 'Failed',
    },
  ];
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllImportOrders}
                  indeterminate={selectedSomeImportOrders}
                />
              </TableCell>
              <TableCell>Order Details</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Source</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  //   selected={isImportOrderSelected}
                  selected={false}
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
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {importOrder.orderDetails}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {format(importOrder.orderDate, 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {importOrder.orderID}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {importOrder.sourceName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {importOrder.sourceDesc}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {importOrder.amountCrypto}
                      {importOrder.cryptoCurrency}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {/* TODO: style status  */}
                    <Typography className={classes.completed}>
                      {importOrder.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip
                      title="Edit Order"
                      arrow
                    >
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.primary,
                          },
                          color: theme.palette.primary.main,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <EditTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Delete Order"
                      arrow
                    >
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.error },
                          color: theme.palette.error.main,
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoTone fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
