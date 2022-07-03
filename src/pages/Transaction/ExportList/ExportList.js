import CustomTablePagination from '@/components/Common/TablePagination';
import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  FormControl,
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
  const [totalRecord, setTotalRecord] = useState(3);
  const [exportOrderList, setExportOrderList] = useState(dataTest);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    billRefernceNumber: '',
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
  const handleOnClickCreateExportOrder = () => {
    navigate('/export/create-order');
  };

  const handleSearch = () => {};

  const handleChangeStartDate = (value) => {};

  const handleChangeEndDate = (value) => {};

  const fetchExportOrderList = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
      };
      // const actionResult = await dispatch(getExportOrderList(params));
      // const dataResult = unwrapResult(actionResult);
      // console.log('dataResult', dataResult);
      // if (dataResult.data) {
      //   setTotalRecord(dataResult.data.totalRecord);
      //   setExportOrderList(dataResult.data.orderList);
      // }
    } catch (error) {
      console.log('Failed to fetch importOrder list: ', error);
    }
  };
  useEffect(() => {
    fetchExportOrderList();
    console.log(new Date().toJSON());
  }, [pages, rowsPerPage]);
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
          startIcon={<Add />}
          onClick={handleOnClickCreateExportOrder}
        >
          Tạo phiếu xuất kho
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
        <div className={classes.labelPanelFilter}>Tìm kiếm theo thông tin</div>
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
            <FormControl fullWidth>
              <InputLabel id="select-creator">Người tạo đơn</InputLabel>
              <Select
                id="creator"
                value={1}
                label="Người tạo"
                // onChange={handleChangeCreator}
              >
                {/* TODO: call api trả về list creator */}
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
                  <ExportOrderTable exportOrders={exportOrderList} />
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

export default ExportList;
