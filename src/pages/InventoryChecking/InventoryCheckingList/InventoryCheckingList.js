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
import React, { useState } from 'react';
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
  const [sortById, setSortById] = useState(1)
  const navigate = useNavigate()

  const handleChangeCreator = (event) => {
    setCreatorId(event.target.value);
  };

  const handleChangeWarehouse = (event) => {
    setWarehouseId(event.target.value);
  };
  const handleChangeSortBy = (event) => {
    setSortById(event.target.value);
  };
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
            <Stack direction='row' justifyContent='space-between'>
            <Typography variant="h6">Khoảng thời gian tạo đơn</Typography>
            <Typography variant="h6" className={classes.sortBy}>Sắp xếp theo</Typography>
            </Stack>
            <Stack
              direction="row"
              py={2}
              justifyContent='space-between'
            >
              <Stack direction="row" >
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
                    <TableCell align='center'>Kho</TableCell>
                    <TableCell align='center'>Ngày kiểm kho</TableCell>
                    <TableCell align='center'>Người kiểm kho</TableCell>
                    <TableCell align='center'>Tổng chênh lệch</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover onClick={() => navigate(`/inventory-checking/detail/${1}`)}>
                  <TableCell align='center'>Kho 1</TableCell>
                    <TableCell align='center'>{FormatDataUtils.formatDate("04/06/2022")}</TableCell>
                    <TableCell align='center'>Trịnh Bá Minh Ninh(ninhtbm)</TableCell>
                    <TableCell align='center'>{FormatDataUtils.formatCurrency(700000)}</TableCell>
                  </TableRow>
                  <TableRow hover>
                  <TableCell align='center'>Kho 1</TableCell>
                    <TableCell align='center'>{FormatDataUtils.formatDate("04/06/2022")}</TableCell>
                    <TableCell align='center'>Trịnh Bá Minh Ninh(ninhtbm)</TableCell>
                    <TableCell align='center'>{FormatDataUtils.formatCurrency(-1400000)}</TableCell>
                  </TableRow>
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
