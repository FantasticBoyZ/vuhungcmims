import SelectWrapper from '@/components/Common/FormsUI/Select';
import ImportOrders from '@/pages/Transaction/ImportList/ImportOrders';
import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useEffect, useState } from 'react';

import CustomTablePagination from '@/components/Common/TablePagination';
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
import AuthService from '@/services/authService';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import { getCreaterList } from '@/slices/StaffSlice';
import { getTempInventoryReturnList } from '@/slices/TempInventoryReturnSlice';
import Label from '@/components/Common/Label';
import FormatDataUtils from '@/utils/formatData';
import { getAllManufacturer } from '@/slices/ManufacturerSlice';

const useStyles = makeStyles((theme) => ({
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
  labelCheckbox: {
    color: '#29A3E2',
  },
  labelPanelFilter: {
    fontSize: '24px',
    margin: '0 24px 24px 24px',
  },
  table: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody td': {},
    '& tbody tr:hover': {
      cursor: 'pointer',
    },
  },
  outDateRecord: {
    backgroundColor: theme.colors.error.lighter,
  },
}));

const getStatusLabel = (exportOrderStatus) => {
  const map = {
    canceled: {
      text: '???? hu???',
      color: 'error',
    },
    completed: {
      text: '???? tr??? h??ng',
      color: 'success',
    },
    pending: {
      text: 'Ch??? tr??? h??ng',
      color: 'warning',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const TempInventoryReturnList = () => {
  const classes = useStyles();
  const today = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [creatorId, setCreatorId] = useState('');
  const [manufacturerId, setManufacturerId] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [tempInventoryReturnList, setTempInventoryReturnList] = useState();
  const navigate = useNavigate();
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  const [selectPending, setSelectPending] = useState(false);
  const [searchParams, setSearchParams] = useState({
    // billRefernceNumber: '',
    // userId: '',
    // startDate: '',
    // endDate: '',
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.tempInventoryReturn }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeCheckboxPending = () => {
    setPage(0);
    setSearchParams({ ...searchParams, statusId: selectPending === false ? 1 : '' });
    searchTempInventoryReturn({
      ...searchParams,
      statusId: selectPending === false ? 1 : '',
    });
    setSelectPending(!selectPending);
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, billReferenceNumber: target.value });
      searchTempInventoryReturn({ ...searchParams, billReferenceNumber: target.value });
      // fetchProductList();
    }
  };

  const handleChangeCreator = (event) => {
    setCreatorId(event.target.value);
    setPage(0);
    setSearchParams({
      ...searchParams,
      userId: event.target.value > 0 ? event.target.value : '',
    });
    searchTempInventoryReturn({
      ...searchParams,
      userId: event.target.value > 0 ? event.target.value : '',
    });
  };

  const handleChangeManufacturer = (event) => {
    setManufacturerId(event.target.value);
    setPage(0);
    setSearchParams({
      ...searchParams,
      manufacturerId: event.target.value > 0 ? event.target.value : '',
    });
    searchTempInventoryReturn({
      ...searchParams,
      manufacturerId: event.target.value > 0 ? event.target.value : '',
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
    searchTempInventoryReturn({
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
    searchTempInventoryReturn({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), 'dd-MM-yyyy') : null,
    });
  };

  const handleOnClickTableRow = (id) => {
    navigate(`/term-inventory/return/detail/${id}`);
  };

  const handleOnClickCreateTempInventoryReturn = () => {
    navigate('/term-inventory/return/create');
  };

  const searchTempInventoryReturn = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getTempInventoryReturnList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setTempInventoryReturnList(dataResult.data.listReturnToManufacturer);
      }
    } catch (error) {
      console.log('Failed to search export order list: ', error);
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
        setStaffList([{ id: 0, name: 'T???t c???' }].concat(dataResult));
      }
    } catch (error) {
      console.log('Failed to fetch staff list: ', error);
    }
  };

  const fetchManufacturerList = async () => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        // ...searchParams,
      };
      const actionResult = await dispatch(getAllManufacturer(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setManufacturerList([{ id: 0, name: 'T???t c???' }, ...dataResult.data.manufacturer]);
      }
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  const fetchTempInventoryReturnList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      };
      const actionResult = await dispatch(getTempInventoryReturnList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setTempInventoryReturnList(dataResult.data.listReturnToManufacturer);
      }
    } catch (error) {
      console.log('Failed to fetch TempInventoryReturn list: ', error);
    }
  };

  useEffect(() => {
    searchTempInventoryReturn(searchParams);
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTempInventoryReturnList();
    getAllStaff();
    fetchManufacturerList();
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
            startIcon={<AddIcon />}
            onClick={handleOnClickCreateTempInventoryReturn}
          >
            T???o phi???u l??u kho
          </Button>
          {/* <Button
          variant="contained"
          color="secondary"
        >
          Xu???t file excel
        </Button>
        <Button
          variant="contained"
          color="secondary"
        >
          Nh???p file excel
        </Button> */}
        </Stack>
      )}
      <Card className={classes.panelFilter}>
        <div className={classes.labelPanelFilter}>T??m ki???m theo th??ng tin</div>
        <Toolbar className={classes.toolbar}>
          {/* <TextField
            id="outlined-basic"
            placeholder="T??m ki???m phi???u l??u kho"
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
          /> */}
          <Box className={classes.searchField}>
            <FormControl fullWidth>
              <InputLabel id="select-creator">Nh?? cung c???p</InputLabel>
              <Select
                id="creator"
                value={manufacturerId}
                label="Nh?? cung c???p"
                onChange={handleChangeManufacturer}
              >
                {manufacturerList.map((item) => (
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
          <Box className={classes.selectBox}>
            {staffList && (
              <FormControl fullWidth>
                <InputLabel id="select-creator">Ng?????i t???o ????n</InputLabel>
                <Select
                  id="creator"
                  value={creatorId}
                  label="Ng?????i t???o ????n"
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
            )}
          </Box>
        </Toolbar>
        <div>
          <div className={classes.labelDateRange}>Kho???ng th???i gian t???o ????n</div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Toolbar>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="startDate"
                  label="Ng??y b???t ?????u"
                  value={startDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    handleChangeStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Box sx={{ mx: 2 }}> ?????n </Box>
                <DatePicker
                  id="endDate"
                  label="Ng??y k???t th??c"
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
                  label="Ch??? hi???n th??? ????n h??ng ??ang ???????c x??? l??"
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
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>M?? l??u kho</TableCell>
                          <TableCell align="center">Ng??y t???o</TableCell>
                          <TableCell align="center">Ng??y tr??? d??? ki???n</TableCell>
                          <TableCell align="center">Nh?? cung c???p</TableCell>
                          <TableCell align="center">Ng?????i t???o ????n</TableCell>
                          <TableCell align="center">Tr???ng th??i</TableCell>
                          <TableCell align="center">Gi?? tr??? ????n h??ng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tempInventoryReturnList &&
                          tempInventoryReturnList.map((tempInventoryReturn) => {
                            return (
                              <Tooltip
                                arrow
                                title={
                                  new Date(tempInventoryReturn.expectedReturnDate) <
                                    today && tempInventoryReturn.statusName === 'pending'
                                    ? '????n l??u kho ???? qu?? ng??y tr??? d??? ki???n'
                                    : ''
                                }
                                key={tempInventoryReturn.id}
                                // interactive
                              >
                                <TableRow
                                  hover
                                  key={tempInventoryReturn.id}
                                  className={
                                    new Date(tempInventoryReturn.expectedReturnDate) <
                                      today &&
                                    tempInventoryReturn.statusName === 'pending'
                                      ? classes.outDateRecord
                                      : null
                                  }
                                  //   selected={istempInventoryReturnSelected}
                                  // selected={false}
                                  onClick={() =>
                                    handleOnClickTableRow(tempInventoryReturn.id)
                                  }
                                >
                                  <TableCell>
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {'LUUKHO' + tempInventoryReturn.id}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {FormatDataUtils.formatDateByFormat(
                                        tempInventoryReturn.createDate,
                                        'dd/MM/yyyy',
                                      )}
                                    </Typography>
                                  </TableCell>

                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {FormatDataUtils.formatDateByFormat(
                                        tempInventoryReturn.expectedReturnDate,
                                        'dd/MM/yyyy',
                                      )}
                                      {/* {tempInventoryReturn.createDate} */}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {tempInventoryReturn.manufacturerName}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {tempInventoryReturn.userCreateFullName +
                                        '(' +
                                        tempInventoryReturn.userCreateName +
                                        ')'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography className={classes.completed}>
                                      {getStatusLabel(tempInventoryReturn.statusName)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Typography
                                      variant="body1"
                                      color="text.primary"
                                      gutterBottom
                                      noWrap
                                    >
                                      {FormatDataUtils.formatCurrency(
                                        tempInventoryReturn.totalAmout || 0,
                                      )}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              </Tooltip>
                            );
                          })}
                      </TableBody>
                    </Table>
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
                  </TableContainer>
                ) : (
                  <>Kh??ng t??m th???y phi???u l??u kho ph?? h???p</>
                )}
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TempInventoryReturnList;
