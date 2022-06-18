import { useEffect, useState } from 'react';
import SelectWrapper from '@/components/FormsUI/Select';
import ImportOrders from '@/pages/Transaction/ImportList/ImportOrders';
import { CloseSharp, Search } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import { Card } from '@mui/material';

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
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getImportOrderList } from '@/slices/ImportOrderSlice';
import { unwrapResult } from '@reduxjs/toolkit';

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
    margin: '24px'
  },
  panelFilter: {
    padding: '24px 0'
  }
});

const createrList = {
  1: 'Vũ Tiến Khôi',
  2: 'Trịnh Bá Minh Ninh',
  3: 'Nguyễn Thị Hiền',
  4: 'Nguyễn Đức Chính',
  5: 'Dương Đức Trọng',
};

const ImportList = () => {
  const classes = useStyles();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowserPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [importOrderList, setImportOrderList] = useState();

  const dispatch = useDispatch();
  // const { loading, importOrderList } = useSelector((state) => ({ ...state.importOrders }))

  const fetchImportOrderList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage
      };
      const actionResult = await dispatch(getImportOrderList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        // setImportOrderList(dataResult.data.product);
      }
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  }

  // hook này để test biến thôi nha
  useEffect(() => {
    console.log(startDate + " " + endDate)
    fetchImportOrderList()
  })

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
        >
          Tạo phiếu nhập kho
        </Button>
        <Button variant="contained"
          color="secondary"
        >Xuất file excel</Button>
        <Button variant="contained"
          color="secondary"
        >Nhập file excel</Button>
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
          // onChange={handleSearch}
          />
          <Box className={classes.selectBox}>
            <Formik
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
            </Formik>
          </Box>
        </Toolbar>
        <div>
          <div className={classes.labelDateRange}>Khoảng thời gian tạo đơn</div>
          <Toolbar>
            <LocalizationProvider dateAdapter={AdapterDateFns}
            >
              <DatePicker
                id='startDate'
                label="Ngày bắt đầu"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Box sx={{ mx: 2 }}> Đến </Box>
              <DatePicker
                id='endDate'
                label="Ngày kết thúc"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
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
          <ImportOrders />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImportList;
