import { getListInventoryChecking } from '@/slices/InventoryCheckingSlice';
import { getStaffList } from '@/slices/StaffSlice';
import { getWarehouseList } from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
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
  sortBy: {
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

const warehouseList = [
  { id: 1, name: 'Kho 1' },
  { id: 2, name: 'Kho 2' },
  { id: 3, name: 'Kho 3' },
  { id: 4, name: 'Kho 4' },
  { id: 5, name: 'Kho 5' },
];

const sortByList = [
  { id: 1, name: 'Ngày tạo mới nhất' },
  { id: 2, name: 'Ngày tạo cũ nhất' },
  { id: 3, name: 'Chênh lệch lớn nhất' },
  { id: 4, name: 'Chênh lệch nhỏ nhất' },
];

const InventoryCheckingList = () => {
  const classes = useStyles();
  const [creatorId, setCreatorId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [sortById, setSortById] = useState(1);
  const [warehouseList, setWarehouseList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [inventoryCheckingList, setInventoryCheckingList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.inventoryChecking }));

  const handleChangeCreator = (event) => {
    setCreatorId(event.target.value);
  };

  const handleChangeWarehouse = (event) => {
    setWarehouseId(event.target.value);
  };
  const handleChangeSortBy = (event) => {
    setSortById(event.target.value);
  };

  const getAllWarehouse = async () => {
    try {
      const actionResult = await dispatch(getWarehouseList());
      const dataResult = unwrapResult(actionResult);
      console.log('warehouse list', dataResult.data);
      if (dataResult.data) {
        setWarehouseList(dataResult.data.warehouse);
      }
    } catch (error) {
      console.log('Failed to fetch warehouse list: ', error);
    }
  };

  const getAllStaff = async () => {
    const params = {
      // pageIndex: page + 1,
      // pageSize: rowsPerPage,
      keyWords  : '',
    };
    try {
      const actionResult = await dispatch(getStaffList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('staff list', dataResult);
      if (dataResult.listStaff) {
        setStaffList(dataResult.listStaff);
      }
    } catch (error) {
      console.log('Failed to fetch staff list: ', error);
    }
  };

  const fetchInventoryCheckingList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        order: 'asc',
      };
      const actionResult = await dispatch(getListInventoryChecking(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setInventoryCheckingList(dataResult.data.listInventoryCheckingHistory);
      }
    } catch (error) {
      console.log('Failed to fetch inventoryChecking list: ', error);
    }
  };

  useEffect(() => {
    getAllStaff()
    getAllWarehouse();
    fetchInventoryCheckingList();
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
              justifyContent="space-between"
              py={2}
            >
              <Box className={classes.selectBox}>
                <FormControl fullWidth>
                  <InputLabel id="select-creator">Kho kiểm</InputLabel>
                  {warehouseList && (
                    <Select
                      id="creator"
                      value={warehouseId}
                      label="Kho kiểm"
                      onChange={handleChangeWarehouse}
                    >
                      {warehouseList.map((item) => (
                        <MenuItem
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Box>
              <Box className={classes.selectBox}>
                <FormControl fullWidth>
                  <InputLabel id="select-creator">Người tạo đơn</InputLabel>
                  <Select
                    id="creator"
                    value={creatorId}
                    label="Người tạo đơn"
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
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography variant="h6">Khoảng thời gian tạo đơn</Typography>
              <Typography
                variant="h6"
                className={classes.sortBy}
              >
                Sắp xếp theo
              </Typography>
            </Stack>
            <Stack
              direction="row"
              py={2}
              justifyContent="space-between"
            >
              <Stack direction="row">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    id="startDate"
                    label="Ngày bắt đầu"
                    // value={startDate}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => {
                      // handleChangeStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <Box sx={{ mx: 2 }}> Đến </Box>
                  <DatePicker
                    id="endDate"
                    label="Ngày kết thúc"
                    inputFormat="dd/MM/yyyy"
                    // value={endDate}
                    onChange={(newValue) => {
                      // handleChangeEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Stack>
              <Box className={classes.selectBox}>
                <FormControl fullWidth>
                  {/* <InputLabel id="select-creator">Sắp xếp theo</InputLabel> */}
                  <Select
                    id="creator"
                    value={sortById}
                    // label="Sắp xếp theo"
                    onChange={handleChangeSortBy}
                  >
                    {sortByList.map((item) => (
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
          </CardContent>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardContent>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Kho</TableCell>
                    <TableCell align="center">Ngày kiểm kho</TableCell>
                    <TableCell align="center">Người kiểm kho</TableCell>
                    <TableCell align="center">Tổng chênh lệch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventoryCheckingList &&
                    inventoryCheckingList.map((inventoryChecking) => (
                      <TableRow
                        hover
                        key={inventoryChecking.id}
                        onClick={() =>
                          navigate(`/inventory-checking/detail/${inventoryChecking.id}`)
                        }
                      >
                        <TableCell align="center">
                          {inventoryChecking.wareHouseName}
                        </TableCell>
                        <TableCell align="center">
                          {FormatDataUtils.formatDate(inventoryChecking.createDate)}
                        </TableCell>
                        <TableCell align="center">
                          Trịnh Bá Minh Ninh({inventoryChecking.userName})
                        </TableCell>
                        <TableCell align="center">
                          {FormatDataUtils.formatCurrency(
                            inventoryChecking.differentAmout,
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InventoryCheckingList;
