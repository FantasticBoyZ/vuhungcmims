import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import AuthService from '@/services/authService';
import exportOrderService from '@/services/exportOrderService';
import { getExportOrderList } from '@/slices/ExportOrderSlice';
import { getCreaterList, getStaffList } from '@/slices/StaffSlice';
import { Add, Search } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ExportOrderTable from './ExportOrderTable';

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
  labelPanelFilter: {
    fontSize: '24px',
    margin: '0 24px 24px 24px',
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
  labelCheckbox: {
    color: '#29A3E2',
  },
});
const createrList = [
  { id: 1, name: 'Vũ Tiến Khôi' },
  { id: 2, name: 'Trịnh Bá Minh Ninh' },
  { id: 3, name: 'Nguyễn Thị Hiền' },
  { id: 4, name: 'Nguyễn Đức Chính' },
  { id: 5, name: 'Dương Đức Trọng' },
];

const ExportList = () => {
  const dataTest = [
    {
      orderId: 1,
      billRefernce: 'VHE101',
      createdDate: '2022-06-30T07:50:48.019Z',
      statusName: 'pending',
      totalAmount: '50',
    },
    {
      orderId: 2,
      billRefernce: 'VHE102',
      createdDate: '2022-01-25',
      statusName: 'completed',
      totalAmount: '50',
    },
    {
      orderId: 3,
      billRefernce: 'VHE103',
      createdDate: '2022-01-25',
      statusName: 'canceled',
      totalAmount: '50',
    },
  ];
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [creatorId, setCreatorId] = useState('');
  const [exportOrderList, setExportOrderList] = useState();
  const [staffList, setStaffList] = useState([]);
  const [selectPending, setSelectPending] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  const [searchParams, setSearchParams] = useState({
    billRefernceNumber: '',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOnClickCreateExportOrder = () => {
    navigate('/export/create-order');
  };

  const handleChangeCheckboxPending = () => {
    setPage(0);
    setSearchParams({ ...searchParams, status: selectPending === false ? 1 : '' });
    searchExportOrder({ ...searchParams, status: selectPending === false ? 1 : '' });
    setSelectPending(!selectPending);
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, billReferenceNumber: target.value });
      searchExportOrder({ ...searchParams, billReferenceNumber: target.value });
      // fetchProductList();
    }
  };

  // const handleChangeCreator = (event) => {
  //   setPage(0);
  //   setCreatorId(event.target.value);
  //   setSearchParams({ ...searchParams, userId: event.target.value > 0 ? event.target.value : '' });
  //   searchExportOrder({ ...searchParams, userId: event.target.value > 0 ? event.target.value : '' });
  // };

  const handleChangeCreator = (staff) => {
    setPage(0);
    setCreatorId(staff ? staff.id : '');
    setSearchParams({
      ...searchParams,
      userId: staff?.id > 0 ? staff.id : '',
    });
    searchExportOrder({
      ...searchParams,
      userId: staff?.id > 0 ? staff.id : '',
    });
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log('startDate', format(new Date(value), 'dd-MM-yyyy'));
    setSearchParams({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
    searchExportOrder({
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
    searchExportOrder({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
  };

  const searchExportOrder = async (searchParams) => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getExportOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setExportOrderList(dataResult.data.orderList);
      }
    } catch (error) {
      console.log('Failed to search export order list: ', error);
    }
  };

  const fetchExportOrderList = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
      };
      const actionResult = await dispatch(getExportOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setExportOrderList(dataResult.data.orderList);
      }
    } catch (error) {
      console.log('Failed to fetch exportOrder list: ', error);
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
    searchExportOrder(searchParams);
    console.log('vào đây');
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchExportOrderList();
    getAllStaff();
  }, []);
  return (
    <Container maxWidth="xl">
      {(currentUserRole === 'ROLE_OWNER' || currentUserRole === 'ROLE_SELLER') && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          p={2}
        >
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleOnClickCreateExportOrder}
          >
            Tạo phiếu xuất kho
          </Button>

          {/* <Button
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
        </Button> */}
        </Stack>
      )}
      <Card className={classes.panelFilter}>
        <div className={classes.labelPanelFilter}>Tìm kiếm theo thông tin</div>
        <Toolbar className={classes.toolbar}>
          <TextField
            id="outlined-basic"
            placeholder="Tìm kiếm phiếu xuất kho"
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
            onChange={(e) => {
              setSearchParams({ ...searchParams, billReferenceNumber: e.target.value });
            }}
          />
          <Box className={classes.selectBox}>
            {/* <FormControl fullWidth>
              <InputLabel id="select-creator">Người tạo đơn</InputLabel>
              {staffList && (
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
              )}
            </FormControl> */}
            <Autocomplete  
              id="combo-box-demo"
              options={staffList}
              getOptionLabel={(staff) => staff.name || ''}
              noOptionsText="Không tìm thấy người tạo đơn"
              onChange={(event, newInputValue) => {
                handleChangeCreator(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Người tạo đơn"
                />
              )}
            />
          </Box>
        </Toolbar>
        <div>
          <div className={classes.labelDateRange}>Khoảng thời gian tạo đơn</div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
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
            <Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectPending}
                      onChange={() => handleChangeCheckboxPending()}
                    />
                  }
                  label="Chỉ hiển thị đơn hàng đang được xử lý"
                  className={classes.labelCheckbox}
                />
              </FormGroup>
            </Box>
          </Stack>
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
              <ProgressCircleLoading />
            ) : (
              <Box>
                {totalRecord > 0 ? (
                  <ExportOrderTable exportOrders={exportOrderList} />
                ) : (
                  <>Không tìm thấy phiếu xuất kho phù hợp</>
                )}
                {!!totalRecord && (
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

export default ExportList;
