import CommonTable from '@/components/Common/CommonTable';
import TextfieldWrapper from '@/components/FormsUI/Textfield';
import CategoryService from '@/services/categoryService';
import { getProductList } from '@/slices/ProductSlice';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Select,
  Stack,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';

const useStyles = makeStyles({
  searchField: {
    width: '30%',
  },
  toolbar: {
    width: '100%',
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    // backgroundColor:'blue',
    padding: '10px',
  },
  selectBoxContainer: {
    width: '50%',
    display: 'flex',
    justifyContent: 'space-around',
    // backgroundColor: 'red',
  },
  selectBox: {
    // backgroundColor: 'green',
    width: '200px',
    height: '56px',
    minHeight: '56px',
  },
});

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 5,
    height: 56,
    minHeight: 56,
  }),
};

const headCells = [
  { id: 'productCode', label: 'Mã sản phẩm' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'category', label: 'Danh mục' },
  { id: 'manufacturer', label: 'Nhà cung cấp' },
  { id: 'inStock', label: 'Tồn kho' },
  // { id: 'createdDate', label: 'Ngày khởi tạo' },
];

const categoryList = {
  1: 'Gạch',
  2: 'Sơn',
  3: 'Xi măng',
};

const manufacturerList = {
  1: 'Hoàng Phát',
  2: 'Surplus',
  3: 'Toyota',
};

const sortTypeList = {
  asc: 'tăng',
  desc: 'giảm',
};

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [inputValueCategory, setInputValueCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchParams, setSearchParams] = useState({
    productName: '',
    productCode: '',
    categoryId: '',
    manufactorId: '',
  });
  const pages = [2, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();

  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    CommonTable(productList, headCells);

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setSearchParams({ ...searchParams, productName: target.value });
      setPage(0);
      // fetchProductList();
    }
  };

  const handleOnClickTableRow = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleOnclickAddNewProduct = () => {
    navigate(`/product/add`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchProductList(newPage, rowsPerPage, searchParams);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // fetchProductList(page, parseInt(event.target.value, 10), searchParams);
  };

  const handleInputChangeCategory = (value) => {
    setInputValueCategory(value);
    console.log('inputValueCategory', value);
  };

  const handleChangeCategory = (value) => {
    setSelectedCategory(value);
    setSearchParams({ ...searchParams, categoryId: value.id });
    console.log('changeCategory', value);
  };

  const fetchCategoryList = async () => {
    try {
      const params = {
        categoryName: '',
      };
      const response = await CategoryService.getAllCategory(params);
      console.log('response', response.data.category);
      // Loại bỏ dư thừa description
      const rawList = response.data.category;
      // return rawList
      // const result = rawList.reduce((map, item) => {
      //   map[item.id] = item.name
      //   return map
      // })
      return rawList;
      // console.log('mapCategoryList',result)
      // setCategoryList(result)
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  };

  useEffect(() => {
    fetchCategoryList();
    const fetchProductList = async () => {
      try {
        const params = {
          pageIndex: page + 1,
          pageSize: rowsPerPage,
          productName: searchParams.productName,
          productCode: searchParams.productCode,
          manufactorId: searchParams.manufactorId,
          categoryId: searchParams.categoryId,
        };
        const actionResult = await dispatch(getProductList(params));
        const dataResult = unwrapResult(actionResult);
        console.log(products);
        console.log('dataResult', dataResult);
        if (dataResult.data) {
          setTotalRecord(dataResult.data.totalRecord);
          setProductList(dataResult.data.product);
        }
      } catch (error) {
        console.log('Failed to fetch product list: ', error);
      }
    };
    fetchProductList();
    // console.log(products.data.product);
    // console.log(loading)
    // console.log('productList', productList);
  }, [page, rowsPerPage, searchParams]);
  return (
    <>
      <Paper>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          p={2}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleOnclickAddNewProduct()}
          >
            Thêm mới
          </Button>
          <Button variant="contained">Xuất file excel</Button>
          <Button variant="contained">Nhập file excel</Button>
        </Stack>
        <Toolbar>
          {/* <Box
            backgroundColor="green"
            fullWidth="true"
            display="flex"
            justifyContent="space-between"
          > */}

          <Box className={classes.toolbar}>
            <Formik
              initialValues={{
                productName: '',
                categoryId: '',
                manufactorId: '1',
                sort: 'asc',
              }}
              // validationSchema={FORM_VALIDATION}
              // onSubmit={handleLogin}
            >
              <Form>
                <Box className={classes.toolbarContainer}>
                  <Box className={classes.searchField}>
                    <TextfieldWrapper
                      id="outlined-basic"
                      name="productName"
                      placeholder="Search"
                      label={null}
                      variant="outlined"
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
                  </Box>
                  <Box className={classes.selectBoxContainer}>
                    <AsyncSelect
                      className={classes.selectBox}
                      styles={customStyles}
                      placeholder="Danh mục"
                      cacheOptions
                      defaultOptions
                      isSearchable={false}
                      components={<Select />}
                      value={selectedCategory}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                      loadOptions={fetchCategoryList}
                      onInputChange={handleInputChangeCategory}
                      onChange={(e) => handleChangeCategory(e)}
                    />
                    {/* TODO: Làm service call api nhà sản xuất */}
                    <AsyncSelect
                      className={classes.selectBox}
                      styles={customStyles}
                      placeholder="Nhà sản xuất"
                      cacheOptions
                      defaultOptions
                      isSearchable={false}
                      components={<Select />}
                      value={selectedCategory}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                      loadOptions={fetchCategoryList}
                      onInputChange={handleInputChangeCategory}
                      onChange={(e) => handleChangeCategory(e)}
                    />
                    <AsyncSelect
                      className={classes.selectBox}
                      styles={customStyles}
                      placeholder="Cái gì đó cần search"
                      cacheOptions
                      defaultOptions
                      isSearchable={false}
                      components={<Select />}
                      value={selectedCategory}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                      loadOptions={fetchCategoryList}
                      onInputChange={handleInputChangeCategory}
                      onChange={(e) => handleChangeCategory(e)}
                    />
                    {/* <SelectWrapper
                      label="Nhà cung cáp"
                      name="manufactorId"
                      options={manufacturerList}
                      className={classes.selectBox}
                    /> */}
                    {/* <SelectWrapper label="Ngày khởi tạo" name="createdAt" options={categoryList}/> */}
                    {/* <SelectWrapper
                      label="Sắp xếp"
                      name="sort"
                      options={sortTypeList}
                      className={classes.selectBox}
                    /> */}
                  </Box>
                </Box>
              </Form>
            </Formik>
            {/* </Box> */}
          </Box>
        </Toolbar>

        {loading ? (
          <> Loading ... </>
        ) : (
          <Box>
            {totalRecord > 0 ? (
              <Box>
              <TblContainer>
              <TblHead />
              <TableBody>
                {productList.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleOnClickTableRow(item.id)}
                  >
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>{item.manufactorName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TblContainer>
            <TablePagination
              component="div"
              page={page}
              rowsPerPageOptions={pages}
              rowsPerPage={rowsPerPage}
              
              count={totalRecord}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            /></Box>
            ): (<Typography> Không tìm có kết quả phù hợp </Typography>)}
            
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ProductList;
