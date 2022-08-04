import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import { getReturnOrderList } from '@/slices/ExportOrderSlice';
import { getCreaterList } from '@/slices/StaffSlice';
import FormatDataUtils from '@/utils/formatData';
import { Search } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  searchField: {
    width: '35%',
  },
  selectBox: {
    width: '35%',
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

const createrList = [
  { id: 1, name: 'Vũ Tiến Khôi' },
  { id: 2, name: 'Trịnh Bá Minh Ninh' },
  { id: 3, name: 'Nguyễn Thị Hiền' },
  { id: 4, name: 'Nguyễn Đức Chính' },
  { id: 5, name: 'Dương Đức Trọng' },
];

const ReturnList = () => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returnOrderList, setReturnOrderList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [creatorId, setCreatorId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const handleChangeCreator = (event) => {
    setPage(0);
    setCreatorId(event.target.value);
    setSearchParams({ ...searchParams, userId: event.target.value > 0 ? event.target.value : '' });
    searchReturnOrderList({ ...searchParams, userId: event.target.value > 0 ? event.target.value : '' });
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, billReferenceNumber: target.value });
      searchReturnOrderList({ ...searchParams, billReferenceNumber: target.value });
    }
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log('startDate', format(new Date(value), 'dd-MM-yyyy'));
    setSearchParams({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
    searchReturnOrderList({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log('endDate', format(new Date(value), 'dd-MM-yyyy'));
    setSearchParams({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
    searchReturnOrderList({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
  };

  const handleOnClickTableRow = (returnOrderId) => {
    navigate(`/export/return/detail/${returnOrderId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchProductList(newPage, rowsPerPage, searchParams);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // fetchProductList(page, parseInt(event.target.value, 10), searchParams);
  };

  const searchReturnOrderList = async (searchParams) => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getReturnOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setReturnOrderList(dataResult.data.returnOrderList);
      }
    } catch (error) {
      console.log('Failed to fetch returnOrder list: ', error);
    }
  };

  const fetchReturnOrderList = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getReturnOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setReturnOrderList(dataResult.data.returnOrderList);
      }
    } catch (error) {
      console.log('Failed to fetch returnOrder list: ', error);
    }
  };

  const getAllStaff = async () => {
    const params = {
      // pageIndex: page + 1,
      // pageSize: rowsPerPage,
      keyWords: '',
    };
    try {
      const actionResult = await dispatch(getCreaterList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('staff list', dataResult);
      if (dataResult) {
        setStaffList([{ id: 0, name: 'Tất cả' }].concat(dataResult));
      }
    } catch (error) {
      console.log('Failed to fetch staff list: ', error);
    }
  };

  useEffect(() => {
    searchReturnOrderList(searchParams);
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchReturnOrderList();
    getAllStaff()
  }, []);
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardContent>
            <Typography variant="h6">Tìm kiếm theo thông tin</Typography>
            <Stack
              direction="row"
              py={2}
              justifyContent="space-between"
            >
              <TextField
                id="outlined-basic"
                name="productName"
                className={classes.searchField}
                placeholder="Mã phiếu xuất"
                label={null}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onKeyDown={handleSearch}
                onChange={(e) => {
                  setSearchParams({ ...searchParams, billReferenceNumber: e.target.value });
                }}
              />
              <Box className={classes.selectBox}>
                <FormControl fullWidth>
                  <InputLabel id="select-creator">Người tạo đơn</InputLabel>
                  <Select
                    id="creator"
                    value={creatorId}
                    label="Người tạo đơn"
                    onChange={handleChangeCreator}
                  >
                    {staffList.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
            <Typography variant="h6">Khoảng thời gian tạo đơn</Typography>
            <Stack
              direction="row"
              py={2}
              alignItems='center'
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="startDate"
                  label="Ngày bắt đầu"
                  value={startDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    handleChangeStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Box sx={{ mx: 2 }}> Đến </Box>
                <DatePicker
                  id="endDate"
                  label="Ngày kết thúc"
                  inputFormat="dd/MM/yyyy"
                  value={endDate}
                  onChange={(newValue) => {
                    handleChangeEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardContent>
            {loading ? (
              <ProgressCircleLoading />
            ) : (
              <Box>
                {totalRecord > 0 ? (
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Ngày tạo</TableCell>
                          <TableCell align="center">Được trả từ mã xuất kho</TableCell>
                          <TableCell align="center">Giá trị đơn hàng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {returnOrderList &&
                          returnOrderList.map((returnOrder, index) => (
                            <TableRow
                              hover
                              key={returnOrder?.orderId}
                              onClick={() => handleOnClickTableRow(returnOrder.orderId)}
                            >
                              <TableCell align="center">
                                {returnOrder.createDate
                                  ? FormatDataUtils.formatDate(returnOrder.createDate)
                                  : 'Không có'}
                              </TableCell>
                              <TableCell align="center">
                                {returnOrder.billRefernce}
                              </TableCell>
                              <TableCell align="center">
                                {FormatDataUtils.formatCurrency(returnOrder.totalPrice)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <CustomTablePagination
                      page={page}
                      pages={pages}
                      rowsPerPage={rowsPerPage}
                      totalRecord={totalRecord}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                ) : (
                  <Box>Không tìm thấy kết quả nào</Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReturnList;
