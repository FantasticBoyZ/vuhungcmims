import SelectWrapper from '@/components/Common/FormsUI/Select';
import ImportOrders from '@/pages/Transaction/ImportList/ImportOrders';
import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Card, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';

import CustomTablePagination from '@/components/Common/TablePagination';
import { getImportOrderList } from '@/slices/ImportOrderSlice';
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const useStyles = makeStyles({
  searchField: {
    width: '30%',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    width: '50%',
  },
  labelDateRange: {
    fontSize: '24px',
    margin: '24px',
  },
  panelFilter: {
    padding: '24px 0',
  },
  cardStyle: {
    padding: '12px',
  },
});

const createrList = [
  { id: 1, name: 'Vũ Tiến Khôi' },
  { id: 2, name: 'Trịnh Bá Minh Ninh' },
  { id: 3, name: 'Nguyễn Thị Hiền' },
  { id: 4, name: 'Nguyễn Đức Chính' },
  { id: 5, name: 'Dương Đức Trọng' },
];

const ImportList = () => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [creatorId, setCreatorId] = useState('');
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [importOrderList, setImportOrderList] = useState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    billRefernceNumber: '',
    userId: '',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.importOrders }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, billReferenceNumber: target.value });
      searchImportOrder({ ...searchParams, billReferenceNumber: target.value });
      // fetchProductList();
    }
  };

  const handleChangeCreator = (event) => {
    setCreatorId(event.target.value);
    setSearchParams({ ...searchParams, userId: event.target.value });
    searchImportOrder({ ...searchParams, userId: event.target.value });
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    console.log('startDate', format(new Date(value), 'dd-MM-yyyy'));
    setSearchParams({ ...searchParams, startDate: format(new Date(value), 'dd-MM-yyyy') });
    searchImportOrder({
      ...searchParams,
      startDate: format(new Date(value), 'dd-MM-yyyy'),
    });
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    console.log('endDate', format(new Date(value), 'dd-MM-yyyy'));
    setSearchParams({ ...searchParams, endDate: format(new Date(value), 'dd-MM-yyyy') });
    searchImportOrder({
      ...searchParams,
      endDate: format(new Date(value), 'dd-MM-yyyy'),
    });
  };

  const handleOnClickCreateImportOrder = () => {
    navigate('/import/create-order');
  };

  const searchImportOrder = async (searchParams) => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getImportOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setImportOrderList(dataResult.data.orderList);
      }
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  };

  const fetchImportOrderList = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
      };
      const actionResult = await dispatch(getImportOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setImportOrderList(dataResult.data.orderList);
      }
    } catch (error) {
      console.log('Failed to fetch importOrder list: ', error);
    }
  };
  // hook này để test biến thôi nha
  useEffect(() => {
    console.log(startDate + ' ' + endDate);
    fetchImportOrderList();
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        p={2}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOnClickCreateImportOrder}
        >
          Tạo phiếu nhập kho
        </Button>
        <Button
          variant="contained"
          color="secondary"
        >
          Xuất file excel
        </Button>
        <Button
          variant="contained"
          color="secondary"
        >
          Nhập file excel
        </Button>
      </Stack>
      <Card className={classes.panelFilter}>
        <Toolbar className={classes.toolbar}>
          <TextField
            id="outlined-basic"
            placeholder="Tìm kiếm phiếu nhập kho"
            label={null}
            variant="outlined"
            className={classes.searchField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onKeyDown={handleSearch}
            // onChange={handleSearch}
          />
          <Box className={classes.selectBox}>
            {/* <Formik
              initialValues={{
                creater: '1',
              }}
              // validationSchema={FORM_VALIDATION}
              // onSubmit={handleLogin}
            >
              <Form>
                <Stack
                  direction="row"
                  spacing={2}
                >
                  <SelectWrapper
                    label="Người tạo"
                    name="creater"
                    options={createrList}
                  />
                </Stack>
              </Form>
            </Formik> */}
            <FormControl fullWidth>
              <InputLabel id="select-creator">Người tạo đơn</InputLabel>
              <Select
                id="creator"
                value={creatorId}
                label="Người tạo"
                onChange={handleChangeCreator}
              >
                {createrList.map((item) => (
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
        </Toolbar>
        <div>
          <div className={classes.labelDateRange}>Khoảng thời gian tạo đơn</div>
          <Toolbar>
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
          </Toolbar>
        </div>
      </Card>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        marginTop={1}
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <Card className={classes.cardStyle}>
            {loading ? (
              <>Loading...</>
            ) : (
              <Box>
                {totalRecord > 0 ? (
                  <ImportOrders importOrders={importOrderList} />
                ) : (
                  <>Không tìm thấy phiếu nhập kho phù hợp</>
                )}
                {totalRecord && (
                  <CustomTablePagination
                    page={page}
                    pages={pages}
                    rowsPerPage={rowsPerPage}
                    totalRecord={totalRecord}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                  />
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImportList;
