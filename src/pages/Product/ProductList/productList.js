import CommonTable from '@/components/Common/CommonTable';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import CategoryService from '@/services/categoryService';
import ManufactorService from '@/services/manufactorService';
import { getProductList } from '@/slices/ProductSlice';
import { Search, Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
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
import { toast } from 'react-toastify';

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
    width: '40%',
    display: 'flex',
    justifyContent: 'space-around',
    // backgroundColor: 'red',
  },
  selectBox: {
    // backgroundColor: 'green',
    width: '250px',
    height: '56px',
    minHeight: '56px',
  },
  tableStyle: {
    padding: '20px',
  },
  panelFilter: {
    padding: '24px 0',
    marginBottom: '24px'
  },
  cardStyle: {
    padding: '12px',
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

// mock data

// const categoryList = {
//   1: 'Gạch',
//   2: 'Sơn',
//   3: 'Xi măng',
// };

// const manufacturerList = {
//   1: 'Hoàng Phát',
//   2: 'Surplus',
//   3: 'Toyota',
// };

// const sortTypeList = {
//   asc: 'tăng',
//   desc: 'giảm',
// };

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [inputValueCategory, setInputValueCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValueManufactor, setInputValueManufactor] = useState('');
  const [selectedManufactor, setSelectedManufactor] = useState(null);
  const [searchParams, setSearchParams] = useState({
    productName: '',
    productCode: '',
    categoryId: '',
    manufactorId: '',
  });
  const pages = [10, 20, 50];
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
      setPage(0);
      searchProduct({ ...searchParams, productName: target.value });
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

  const handleInputChangeManufactor = (value) => {
    setInputValueCategory(value);
    console.log('inputValueManufactor', value);
  };

  const handleChangeCategory = (value) => {
    setSelectedCategory(value);
    setSearchParams({ ...searchParams, categoryId: value.id });
    searchProduct({ ...searchParams, categoryId: value.id });
    console.log('changeCategory', value);
  };
  // TODO: searchParam không thay đổi ngay sau khi setSearchParam
  const handleChangeManufactor = (value) => {
    setSelectedManufactor(value);
    setSearchParams({ ...searchParams, manufactorId: value.id });
    searchProduct({ ...searchParams, manufactorId: value.id });
    console.log('changeManufactor', value);
  };

  const fetchCategoryList = async () => {
    try {
      const params = {
        categoryName: '',
      };
      const response = await CategoryService.getCategoryList(params);
      console.log('response category', response.data.category);

      const rawList = response.data.category;
      return rawList;
      // console.log('mapCategoryList',result)
      // setCategoryList(result)
    } catch (error) {
      toast.error('Failed to fetch category list: ', error);
      console.log('Failed to fetch category list: ', error);
    }
  };

  const fetchManufactorList = async () => {
    try {
      const params = {
        manufactorName: '',
      };
      const response = await ManufactorService.getManufactorList(params);
      console.log('response manufactor', response.data.manufactor);

      const rawList = response.data.manufactor;
      return rawList;
    } catch (error) {
      toast.error('Failed to fetch manufactor list: ', error);
      console.log('Failed to fetch manufactor list: ', error);
    }
  };

  const searchProduct = async (searchParams) => {
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
      console.log('searchProduct', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data.product);
      }
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  };

  const fetchProductList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
        // productName: searchParams.productName,
        // productCode: searchParams.productCode,
        // manufactorId: searchParams.manufactorId,
        // categoryId: searchParams.categoryId,
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

  useEffect(() => {
    fetchProductList();
    // return () => {
    //   // fetchCategoryList();

    // }

    // console.log(products.data.product);
    // console.log(loading)
    // console.log('productList', productList);
  }, [page, rowsPerPage]);
  return (
    <>
      <Container maxWidth='xl'>
        <Stack
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
        </Stack>
        <Card className={classes.panelFilter}>
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
                      {/* TODO: handleChange search */}
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
                        // onChange={handleSearchChange}
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
                        loadOptions={() => fetchCategoryList()}
                        onInputChange={handleInputChangeCategory}
                        onChange={(e) => handleChangeCategory(e)}
                      />

                      <AsyncSelect
                        className={classes.selectBox}
                        styles={customStyles}
                        placeholder="Nhà cung cấp"
                        cacheOptions
                        defaultOptions
                        isSearchable={false}
                        components={<Select />}
                        value={selectedManufactor}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        loadOptions={() => fetchManufactorList()}
                        onInputChange={handleInputChangeManufactor}
                        onChange={(e) => handleChangeManufactor(e)}
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
        </Card>

        {loading ? (
          <> Loading ... </>
        ) : (
          <Card className={classes.tableStyle}>
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
                        <TableCell>{item.productCode}</TableCell>
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
                />
              </Box>
            ) : (
              <Typography> Không tìm có kết quả phù hợp </Typography>
            )}
          </Card>
        )}
      </Container>
    </>
  );
};

export default ProductList;
