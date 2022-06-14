import CommonTable from '@/components/Common/CommonTable';
import SelectWrapper from '@/components/FormsUI/Select';
import TextfieldWrapper from '@/components/FormsUI/Textfield';
import { getProductList } from '@/slices/ProductSlice';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import  CategoryService  from '@/services/categoryService'

const useStyles = makeStyles({
  searchField: {
    width: '30%',
  },
  toolbar: {
    
    width:'100%'
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

    // backgroundColor: 'green'
    
  }
});

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
  const [categoryList, setCategoryList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    productName: '',
    productCode: '',
    categoryId: '',
    manufactorId: '',
  });
  const pages = [2, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const classes = useStyles();
  const dispatch = useDispatch();


  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    CommonTable(productList, headCells);

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      if (target.value === '') return;
      else {
        const search = {
          productName: target.value,
          productCode: '',
          categoryId: '',
          manufactorId: '',
        };
        setSearchParams({ search });
        fetchProductList(page, rowsPerPage, search);
      }
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
    fetchProductList(newPage, rowsPerPage, searchParams);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchProductList(page, parseInt(event.target.value, 10), searchParams);
  };

  const handleChangeSelectCategory = (e, object) => {
    console.log(e.target.value)
    console.log('object 141', object)
  }

  const fetchCategoryList = async () => {
    try {
      const params = {
        categoryName: '',
      }
      const response = await CategoryService.getAllCategory(params)
      console.log(response.data.product)
      // Loại bỏ dư thừa description
      const rawList = response.data.product;
      const result = rawList.reduce((map, item) => {
        map[item.id] = item.name
        return map
      })
      console.log('mapCategoryList',result)
      setCategoryList(result)
    } catch (error) {
      console.log('Failed to fetch category list: ', error);
    }
  }

  const fetchProductList = async (page, rowsPerPage, searchParams) => {
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
      console.log(dataResult.data.product);
      setProductList(dataResult.data.product);
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  };

  useEffect(() => {
    fetchCategoryList()
    fetchProductList(page, rowsPerPage, searchParams);

    // console.log(products.data.product);
    // console.log(loading)
    // console.log('productList', productList);
  }, []);
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
                <Box className={classes.toolbarContainer} >
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
                  <Box className={classes.selectBoxContainer} >
                    <SelectWrapper
                      label="Nhóm hàng"
                      name="categoryId"
                      options={categoryList}
                      className={classes.selectBox}
                      onClick={(props) => console.log(props.values)}
                    />
                    <SelectWrapper
                      label="Nhà cung cáp"
                      name="manufactorId"
                      options={manufacturerList}
                      className={classes.selectBox}
                    />
                    {/* <SelectWrapper label="Ngày khởi tạo" name="createdAt" options={categoryList}/> */}
                    <SelectWrapper
                      label="Sắp xếp"
                      name="sort"
                      options={sortTypeList}
                      className={classes.selectBox}
                    />
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
              // TODO: trả về product.length
              count={3}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        )}
      </Paper>
    </>
  );
};

export default ProductList;
