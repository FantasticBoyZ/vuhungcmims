import CommonTable from '@/components/Common/CommonTable';
import SelectWrapper from '@/components/FormsUI/Select';
import productService from '@/services/productService';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductList } from '@/slices/ProductSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const useStyles = makeStyles({
  searchField: {
    width: '30%',
  },
  toolbar: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    width: '50%',
  },
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
  const classes = useStyles();
  const dispatch = useDispatch();

  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    },
  });

  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    CommonTable(productList, headCells, filterFn);

  // const handleSearch = (e) => {
  //   let target = e.target;
  //   setFilterFn({
  //     fn: (items) => {
  //       if (target.value === '') return items;
  //       else return items.filter((x) => x.name.toLowerCase().includes(target.value));
  //     },
  //   });
  // };

  const handleOnClickTableRow = (productId) => {
    navigate(`/product/${productId}`);
  };

  const fetchProductList = async () => {
    try {
      const params = {
        page: 1,
        size: 10,
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
    fetchProductList();

    // console.log(products.data.product);
    // console.log(loading)
    // console.log('productList', productList);
  }, []);
  return (
    <>
      {loading ? (
        <> Loading ... </>
      ) : (
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
            >
              Thêm mới
            </Button>
            <Button variant="contained">Xuất file excel</Button>
            <Button variant="contained">Nhập file excel</Button>
          </Stack>
          <Toolbar className={classes.toolbar}>
            {/* <Box
            backgroundColor="green"
            fullWidth="true"
            display="flex"
            justifyContent="space-between"
          > */}
            <TextField
              id="outlined-basic"
              placeholder="Search"
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
                  category: '1',
                  manufacturer: '1',
                  sort: 'asc',
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
                      label="Nhóm hàng"
                      name="category"
                      options={categoryList}
                    />
                    <SelectWrapper
                      label="Nhà cung cáp"
                      name="manufacturer"
                      options={manufacturerList}
                    />
                    {/* <SelectWrapper label="Ngày khởi tạo" name="createdAt" options={categoryList}/> */}
                    <SelectWrapper
                      label="Sắp xếp"
                      name="sort"
                      options={sortTypeList}
                    />
                  </Stack>
                </Form>
              </Formik>
              {/* </Box> */}
            </Box>
          </Toolbar>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordsAfterPagingAndSorting().map((item) => (
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
          <TblPagination />
        </Paper>
      )}
    </>
  );
};

export default ProductList;
