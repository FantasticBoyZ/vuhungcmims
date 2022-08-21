import CustomTablePagination from '@/components/Common/TablePagination';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  CardHeader,
  CardContent,
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
import FormatDataUtils from '@/utils/formatData';
const useStyles = makeStyles({
  searchField: {
    width: '60%',
    padding: '10px 14px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    // backgroundColor: 'green',
    width: '150px',
    height: '56px',
    minHeight: '56px',
  },
  labelDateRange: {
    fontSize: '24px',
    margin: '24px',
  },
  cardFilter: {
    padding: '20px 0',
    boxShadow:
      '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    background: '#fff',
  },
  cardTable: {
    padding: '0 20px',
  },
  btnSearch: {
    width: '200px',
    // minHeight: '56px',
  },
});

const optionSelect = [
  {
    value: 'manufactorName',
    label: 'Tên',
  },
  // {
  //   value: 'provinceName',
  //   label: 'Khu vực',
  // },
];

const ManufacturerList = () => {
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [keyword, setKeyword] = useState();
  const [searchParams, setSearchParams] = useState({
    manufactorName: '',
  });
  const [searchBy, setSearchBy] = useState('manufactorName');
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

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearch = (e) => {
    setPage(0);
    searchManufacurer({ ...searchParams, manufactorName: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
    setSearchParams({ ...searchParams, manufactorName: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
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
        setManufacturerList(dataResult.data.manufacturer);
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
    searchManufacurer(searchParams);
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchManufacturerList();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      justifyContent="flex-end"
    >
      <Stack
        direction="row"
        spacing={2}
        paddingY={2}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOnclickAddNewManufacturer()}
        >
          Thêm nhà sản xuất mới
        </Button>
      </Stack>
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardHeader title="Tìm kiếm thông tin nhà sản xuất" />
          <Stack
            direction="row"
            spacing={2}
            padding={2}
          >
            <TextField
              id="outlined-basic"
              name="keyword"
              placeholder="Tìm kiếm theo tên nhà cung cấp..."
              fullWidth
              label={null}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearchChange}
            />
            {/* <Select
              classNamePrefix="select"
              className={classes.btnSearch}
              value={optionSelect.filter((option) => option.value === searchBy)}
              defaultValue={optionSelect[0]}
              name="searchBy"
              options={optionSelect}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  height: 56,
                  minHeight: 56,
                }),
              }}
              onChange={(e) => setSearchBy(e.value)}
            /> */}
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              className={classes.btnSearch}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Box>
          <Card className={classes.cardTable}>
            {loading ? (
              <ProgressCircleLoading />
            ) : (
              <Box>
                {totalRecord > 0 ? (
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
                ) : (
                  <Stack py={2}>
                    <Typography>Không tìm thấy nhà cung cấp phù hợp</Typography>
                  </Stack>
                )}
              </Box>
            )}
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ManufacturerList;
