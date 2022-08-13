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
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';
import { useState } from 'react';
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

const getStatusLabel = (importOrderStatus) => {
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

  const { text, color } = map[importOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const ImportOrdersTable = ({ importOrders }) => {
  const [selectedImportOrders, setSelectedImportOrders] = useState([]);
  const classes = useStyles();
  const theme = useTheme();
  const selectedBulkActions = selectedImportOrders.length > 0;
  const navigate = useNavigate();
  let selectedSomeImportOrders = false;
  let selectedAllImportOrders = false;
  if (!!importOrders) {
    selectedSomeImportOrders =
      selectedImportOrders.length > 0 &&
      selectedImportOrders.length < importOrders.length;
    selectedAllImportOrders = selectedImportOrders.length === importOrders.length;
  }

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

  const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const handleOnClickTableRow = (id) => {
    navigate(`/import/detail/${id}`);
  };
  return (
    <Box>
      {!!importOrders && (
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
                <TableCell align="center">Mã nhập kho</TableCell>
                <TableCell align="center">Tham chiếu</TableCell>
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Ngày nhập</TableCell>
                <TableCell align="center">Nhà cung cấp</TableCell>
                <TableCell align="center">Người tạo đơn</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Giá trị đơn hàng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {importOrders.map((importOrder) => {
                // TODO: làm selectedImportOrders
                //   const isImportOrderSelected = selectedImportOrders.includes(importOrder.id);
                return (
                  <TableRow
                    hover
                    key={importOrder.orderId}
                    className={classes.tableRow}
                    //   selected={isImportOrderSelected}
                    selected={false}
                    onClick={(value) => handleOnClickTableRow(importOrder.orderId)}
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
                        align="center"
                      >
                        {"NHAP"+importOrder.orderId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                        align="center"
                      >
                        {importOrder.billRefernce}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                        align="center"
                      >
                        {formatDate(importOrder.createDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {importOrder?.importDate && (
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {FormatDataUtils.formatDate(
                            importOrder?.importDate,
                          )}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                        align="center"
                      >
                        {importOrder.manufactorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                        align="center"
                      >
                        {importOrder.fullName + '(' + importOrder.userName +')'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{getStatusLabel(importOrder.statusName)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography>{FormatDataUtils.formatCurrency(importOrder.totalPrice)}</Typography>
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

export default ImportOrdersTable;
