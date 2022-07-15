import CustomTablePagination from '@/components/Common/TablePagination';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  InputAdornment, Stack,
  TextField,
  Toolbar,
  Typography,
  FormControl, InputLabel,

} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ManufacturerTable from './ManufacturerTable';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';
import SearchIcon from '@mui/icons-material/Search';
const useStyles = makeStyles({
  searchField: {
    width: '60%',
    padding: '10px 14px'
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
  cardFilter: {
    padding: '20px 0',
    marginBottom: '20px',
  },
  cardTable: {
    padding: '0 20px',
  },
  text: {
    paddingBottom: '1%',
    paddingLeft: '2%'
  },
  style: {
    width: '130px',
    height: '56px',
    // minHeight: '56px',
  }
});

const optionSelect = [{
  value: 1, label: "Tên"
}, {
  value: 2, label: "Khu vực"
}]

const ManufacturerList = () => {
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    manufactorName: '',
  });
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));

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
      searchManufacurer({ ...searchParams, manufactorName: target.value });
    }
  };

  const handleOnclickAddNewManufacturer = () => {
    navigate('/manufacturer/add');
  };

  const searchManufacurer = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getManufacturerList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setManufacturerList(dataResult.data.manufactor);
      }
    } catch (error) {
      console.log('Failed to fetch manufacturer list: ', error);
    }
  };

  const fetchManufacturerList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getManufacturerList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setManufacturerList(dataResult.data.manufacturer);
      }
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  useEffect(() => {
    fetchManufacturerList();
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ marginBottom: '20px' }}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          p={2}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOnclickAddNewManufacturer()}
          >
            Thêm nhà sản xuất mới
          </Button>
        </Stack>
        <Card className={classes.cardFilter}>
          <Typography className={classes.text}>
            Tìm kiếm thông tin nhà sản xuất
          </Typography>
          <Toolbar className={classes.toolbar}>
            <TextField
              id="outlined-basic"
              placeholder="Tìm kiếm theo..."
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
            <Button className={classes.style} color='primary' variant="contained" startIcon={<SearchIcon />}> Tìm kiếm</Button>
          </Toolbar>

        </Card>
      </Box>
      <Box>
        <Card className={classes.cardTable}>
          {loading ? (
            <ProgressCircleLoading />
          ) : (
            <Box>
              <ManufacturerTable manufacturerList={manufacturerList} />
              <CustomTablePagination
                page={page}
                pages={pages}
                rowsPerPage={rowsPerPage}
                totalRecord={totalRecord}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Box>
          )}
        </Card>
      </Box>
    </Container>
  );
};

export default ManufacturerList;
