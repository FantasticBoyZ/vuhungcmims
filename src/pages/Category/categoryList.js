import Popup from '@/components/Common/Popup';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import CategoryTable from '@/pages/Category/CategoryTable/CategoryTable';
import { getCategoryList } from '@/slices/CategorySlice';
import { Add, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Container } from '@mui/system';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CategoryForm from './AddEditCategory/CategoryForm';

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
  cardFilter: {
    padding: '20px 0',
    marginBottom: '20px',
  },
  cardTable: {
    padding: '0 20px',
  },
  buttonAdd: {
    height: '36px !important',
  },
});

const CategoryList = () => {
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [allCategoryList, setAllCategoryList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [searchParams, setSearchParams] = useState({
    categoryName: '',
  });
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.categories }));

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
      searchCategory({ ...searchParams, categoryName: target.value });
      // fetchProductList();
    }
  };

  const handleOnclickAddNewProduct = () => {
    // navigate('/category/add');
    // getAllCategory();
    setOpenPopup(true);
  };

  const closePopup = () => {
    setOpenPopup(false);
    searchCategory(searchParams);
  };

  const searchCategory = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getCategoryList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setCategoryList(dataResult.data.category);
      }
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  const getAllCategory = async (keyword) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        categoryName: keyword,
      };
      const actionResult = await dispatch(getCategoryList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setAllCategoryList(dataResult.data.category);
      }
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  const fetchCategoryList = async (params) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await dispatch(getCategoryList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setCategoryList(dataResult.data.category);
      }
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    getAllCategory();
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ marginBottom: '20px' }}>
        {/* <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          p={2}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOnclickAddNewProduct()}
          >
            Thêm mới
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
        </Stack> */}
        <Card className={classes.cardFilter}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            p={2}
          >
            <TextField
              id="outlined-basic"
              placeholder="Tìm kiếm theo tên danh mục"
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
            <Button
              variant="contained"
              startIcon={<Add />}
              className={classes.buttonAdd}
              onClick={() => handleOnclickAddNewProduct()}
            >
              Thêm mới danh mục mới
            </Button>
          </Stack>
        </Card>
      </Box>
      <Box>
        <Card className={classes.cardTable}>
          {loading ? (
            <ProgressCircleLoading />
          ) : (
            <Box>
              {totalRecord > 0 ? (
                <Box>
                  <CategoryTable
                    categoryList={categoryList}
                    allCategoryList={allCategoryList}
                    searchCategory={() => searchCategory(searchParams)}
                  />
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
                <CardContent>Không tìm thấy danh mục nào</CardContent>
              )}
            </Box>
          )}
        </Card>
      </Box>
      <Popup
        title="Thêm danh mục"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CategoryForm
          closePopup={closePopup}
          allCategoryList={allCategoryList}
        />
      </Popup>
    </Container>
  );
};

export default CategoryList;
