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
  CardContent,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
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
import Select from 'react-select';
import { toast } from 'react-toastify';
import FormatDataUtils from '@/utils/formatData';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';

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
  },
  selectBoxContainer: {
    width: '40%',
  },
  selectBox: {
    // backgroundColor: 'green',
    width: '250px',
    height: '56px',
    minHeight: '56px',
  },
  tableStyle: {
    textAlign: 'center',
    // minHeight: '60vh'
  },
  panelFilter: {
    padding: '24px 0',
    marginBottom: '24px',
  },
  cardStyle: {
    padding: '12px',
  },
  table: {
    // marginTop: theme.spacing(3),
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
  filterTitle: {
    fontSize: '24px',
    padding: '0 24px',
    marginBottom: '8px',
  },
});

const customStyles = {
  control: (base) => ({
    ...base,
    borderRadius: 5,
    height: 56,
    minHeight: 56,
    zIndex: 9999,
  }),
};

const headCells = [
  { id: 'productCode', label: 'M?? s???n ph???m' },
  { id: 'productName', label: 'T??n s???n ph???m' },
  { id: 'category', label: 'Danh m???c' },
  { id: 'manufacturer', label: 'Nh?? cung c???p' },
  { id: 'inStock', label: 'T???n kho' },
  // { id: 'createdDate', label: 'Ng??y kh???i t???o' },
];

// mock data

// const categoryList = {
//   1: 'G???ch',
//   2: 'S??n',
//   3: 'Xi m??ng',
// };

// const manufacturerList = {
//   1: 'Ho??ng Ph??t',
//   2: 'Surplus',
//   3: 'Toyota',
// };

// const sortTypeList = {
//   asc: 't??ng',
//   desc: 'gi???m',
// };

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [inputValueCategory, setInputValueCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [inputValueManufactor, setInputValueManufactor] = useState('');
  const [selectedManufactor, setSelectedManufactor] = useState(null);
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  const [searchParams, setSearchParams] = useState({
    // productName: '',
    // productCode: '',
    // categoryId: '',
    // manufactorId: '',
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
      setSearchParams({ ...searchParams, productName: target.value });
      searchProduct({ ...searchParams, productName: target.value });
      // fetchProductList();
    }
  };

  // const handleSearchChange = (e) => {
  //   setSearchParams({ ...searchParams, productName: e.target.value });
  // };

  const handleOnClickTableRow = (productId) => {
    navigate(`/product/detail/${productId}`);
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
    setPage(0);
    setSearchParams({ ...searchParams, categoryId: value ? value?.value : value});
    searchProduct({ ...searchParams, categoryId: value ? value?.value : value});
    console.log('changeCategory', value);
  };
  // TODO: searchParam kh??ng thay ?????i ngay sau khi setSearchParam
  const handleChangeManufactor = (value) => {
    setSelectedManufactor(value);
    setPage(0);
    setSearchParams({ ...searchParams, manufactorId: value ? value?.value : value});
    searchProduct({ ...searchParams, manufactorId: value ? value?.value : value});
    console.log('changeManufactor', value);
  };

  const fetchCategoryList = async () => {
    try {
      const params = {
        categoryName: '',
      };
      await CategoryService.getAllCategoryList(params).then(
        (response) => {
          setCategoryList(response.data.category);
          console.log('response category', response.data.category);
        },
        (error) => {
          toast.error('Failed to fetch category list: ', error);
        },
      );

      // const rawList = response.data.category;
      // return rawList;
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
        manufacturerName: '',
      };
      await ManufactorService.getAllManufacturer(params).then(
        (response) => {
          setManufacturerList(response.data.manufacturer);
          console.log('response manufactor', response.data.manufacturer);
        },
        (error) => {
          toast.error('Failed to fetch manufacturer list: ', error);
        },
      );

      // const rawList = response.data.manufacturer;
      // return rawList;
    } catch (error) {
      toast.error('Failed to fetch manufacturer list: ', error);
      console.log('Failed to fetch manufactor list: ', error);
    }
  };

  const searchProduct = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        productName: searchParams.productName ? FormatDataUtils.removeExtraSpace(searchParams.productName) : '',
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
    fetchCategoryList();
    fetchManufactorList();
    // return () => {
    //   // fetchCategoryList();

    // }

    // console.log(products.data.product);
    // console.log(loading)
    // console.log('productList', productList);
  }, [page, rowsPerPage]);
  return (
    <>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          py={2}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOnclickAddNewProduct()}
          >
            Th??m s???n ph???m m???i
          </Button>
        </Stack>
        <Card className={classes.panelFilter}>
          <Box className={classes.filterTitle}>
            <Typography variant="p">T??m ki???m th??ng tin s???n ph???m</Typography>
          </Box>
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
                        placeholder="T??m ki???m theo t??n s???n ph???m"
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
                        onKeyDown={handleSearch}
                        // onChange={handleSearchChange}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      className={classes.selectBoxContainer}
                    >
                      {categoryList && (
                        <Select
                          classNamePrefix="select"
                          className={classes.selectBox}
                          placeholder="Danh m???c"
                          noOptionsMessage={() => <>Kh??ng c?? t??m th???y danh m???c ph?? h???p</>}
                          isClearable={true}
                          isSearchable={true}
                          name="categoryId"
                          value={selectedCategory}
                          options={FormatDataUtils.getOptionWithIdandName(categoryList)}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                              ...base,
                              height: 56,
                              minHeight: 56,
                            }),
                          }}
                          onChange={(e) => handleChangeCategory(e)}
                        />
                      )}
                      {manufacturerList && (
                        <Select
                          classNamePrefix="select"
                          className={classes.selectBox}
                          placeholder="Nh?? cung c???p"
                          noOptionsMessage={() => (
                            <>Kh??ng c?? t??m th???y nh?? cung c???p ph?? h???p</>
                          )}
                          isClearable={true}
                          isSearchable={true}
                          name="categoryId"
                          value={selectedManufactor}
                          options={FormatDataUtils.getOptionWithIdandName(
                            manufacturerList,
                          )}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                              ...base,
                              height: 56,
                              minHeight: 56,
                            }),
                          }}
                          onChange={(e) => handleChangeManufactor(e)}
                        />
                      )}
                    </Stack>
                  </Box>
                </Form>
              </Formik>
              {/* </Box> */}
            </Box>
          </Toolbar>
        </Card>
        <Card className={classes.tableStyle}>
          {loading ? (
            <CardContent>
              <ProgressCircleLoading />
            </CardContent>
          ) : (
            <CardContent>
              {totalRecord > 0 ? (
                <Box>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>M?? s???n ph???m</TableCell>
                        <TableCell>T??n s???n ph???m</TableCell>
                        <TableCell align="center">Danh m???c</TableCell>
                        <TableCell align="center">Nh?? cung c???p</TableCell>
                        <TableCell align="center">????n v??? t??nh</TableCell>
                        <TableCell align="center">T???n kho</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productList.map((item, index) => {
                        const newSelectdUnitMeasureList = selectedUnitMeasureList.slice();
                        return (
                          <TableRow
                            hover
                            key={item.id}
                            onClick={() => handleOnClickTableRow(item.id)}
                          >
                            <TableCell>{item.productCode}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="center">{item.categoryName}</TableCell>
                            <TableCell align="center">{item.manufactorName}</TableCell>
                            <TableCell
                              align="center"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {item.wrapUnitMeasure == null ? (
                                item.unitMeasure
                              ) : (
                                <Stack
                                  direction="row"
                                  justifyContent="center"
                                >
                                  <Select
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    defaultValue={
                                      FormatDataUtils.getOption([
                                        {
                                          number: 1,
                                          name: item.unitMeasure,
                                        },
                                        {
                                          number: item.numberOfWrapUnitMeasure,
                                          name: item.wrapUnitMeasure,
                                        },
                                      ])[0]
                                    }
                                    options={FormatDataUtils.getOption([
                                      {
                                        number: 1,
                                        name: item.unitMeasure,
                                      },
                                      {
                                        number: item.numberOfWrapUnitMeasure,
                                        name: item.wrapUnitMeasure,
                                      },
                                    ])}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    onChange={(e) => {
                                      // console.log(e.label);
                                      if (
                                        e.label === item.wrapUnitMeasure &&
                                        newSelectdUnitMeasureList[index] !==
                                          item.wrapUnitMeasure
                                      ) {
                                        newSelectdUnitMeasureList[index] =
                                          item.wrapUnitMeasure;
                                        // console.log(
                                        //   'wrapUnitMeasure',
                                        //   newSelectdUnitMeasureList[index],
                                        // );
                                        setSelectedUnitMeasureList(
                                          newSelectdUnitMeasureList,
                                        );
                                      }
                                      if (
                                        e.label === item.unitMeasure &&
                                        newSelectdUnitMeasureList[index] !==
                                          item.unitMeasure
                                      ) {
                                        newSelectdUnitMeasureList[index] =
                                          item.unitMeasure;
                                        // console.log(
                                        //   'unitMeasure',
                                        //   newSelectdUnitMeasureList[index],
                                        // );
                                        setSelectedUnitMeasureList(
                                          newSelectdUnitMeasureList,
                                        );
                                      }
                                      // console.log(selectedUnitMeasureList);
                                    }}
                                  />
                                  {selectedUnitMeasureList[index] ===
                                    item.wrapUnitMeasure && (
                                    <TooltipUnitMeasure
                                      quantity={
                                        item.quantity / item.numberOfWrapUnitMeasure
                                      }
                                      wrapUnitMeasure={item.wrapUnitMeasure}
                                      numberOfWrapUnitMeasure={
                                        item.numberOfWrapUnitMeasure
                                      }
                                      unitMeasure={item.unitMeasure}
                                      isConvert={false}
                                    />
                                  )}
                                </Stack>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {selectedUnitMeasureList[index] === item.wrapUnitMeasure
                                ? FormatDataUtils.getRoundFloorNumber(
                                    item.quantity / item.numberOfWrapUnitMeasure,
                                    2,
                                  )
                                : (item.quantity || 0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                <Typography> Kh??ng t??m th???y k???t qu??? ph?? h???p </Typography>
              )}
            </CardContent>
          )}
        </Card>
      </Container>
    </>
  );
};

export default ProductList;
