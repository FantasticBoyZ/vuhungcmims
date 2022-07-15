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
import React, { useState } from 'react';

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
  const [creatorId, setCreatorId] = useState('');

  const handleChangeCreator = (event) => {
    setCreatorId(event.target.value);
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
                // onKeyDown={handleSearch}
                // onChange={handleSearchChange}
              />
              <Box className={classes.selectBox}>
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
            </Stack>
            <Typography variant="h6">Khoảng thời gian tạo đơn</Typography>
            <Stack
              direction="row"
              py={2}
            >
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
                    <TableCell align='center'>Ngày tạo</TableCell>
                    <TableCell align='center'>Được trả từ mã xuất kho</TableCell>
                    <TableCell align='center'>Giá trị đơn hàng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell align='center'>{FormatDataUtils.formatDate("04/06/2022")}</TableCell>
                    <TableCell align='center'>ABC1234</TableCell>
                    <TableCell align='center'>{FormatDataUtils.formatCurrency(700000)}</TableCell>
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

export default ReturnList;
