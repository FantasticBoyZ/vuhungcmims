import Label from '@/components/Common/Label';
import FormatDataUtils from '@/utils/formatData';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
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
}));
const getStatusLabel = (exportOrderStatus) => {
  const map = {
    canceled: {
      text: 'Đã huỷ',
      color: 'error',
    },
    completed: {
      text: 'Đã nhập kho',
      color: 'success',
    },
    pending: {
      text: 'Đang chờ xử lý',
      color: 'warning',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const ExportOrderTable = ({ exportOrders }) => {
    const [selectedExportOrders, setSelectedExportOrders] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const selectedBulkActions = selectedExportOrders.length > 0;
  const navigate = useNavigate();
  let selectedSomeExportOrders = false;
  let selectedAllExportOrders = false;
  if (!!exportOrders) {
    selectedSomeExportOrders =
      selectedExportOrders.length > 0 &&
      selectedExportOrders.length < exportOrders.length;
    selectedAllExportOrders = selectedExportOrders.length === exportOrders.length;
  }
  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const handleOnClickTableRow = (id) => {
    navigate(`/export/detail/${id}`);
  }
  return (
    <Box>
      {!!exportOrders && (
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedAllExportOrders}
                    indeterminate={selectedSomeExportOrders}
                  />
                </TableCell>
                <TableCell>Mã xuất kho</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Giá trị đơn hàng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exportOrders.map((exportOrder) => {
                // TODO: làm selectedexportOrders
                //   const isexportOrderSelected = selectedExportOrders.includes(exportOrder.id);
                return (
                  <TableRow
                    hover
                    key={exportOrder.orderId}
                    className={classes.tableRow}
                    //   selected={isExportOrderSelected}
                    selected={false}
                    onClick={(value) => handleOnClickTableRow(exportOrder.orderId)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        //   checked={isExportOrderSelected}
                        checked={false}
                        // TODO: create function handle onclick checkbox
                        //   onChange={(event) =>
                        //     handleSelectOneExportOrder(event, exportOrder.id)
                        //   }

                        //   value={isExportOrderSelected}
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
                        {exportOrder.billRefernce}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {FormatDataUtils.formatDateTime(exportOrder.createdDate)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography className={classes.completed}>
                        {getStatusLabel(exportOrder.statusName)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {exportOrder.totalAmount}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ExportOrderTable;
