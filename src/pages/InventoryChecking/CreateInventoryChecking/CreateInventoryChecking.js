import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import {
  createInventoryChecking,
  getConsignmentByProductId,
  getProductByWarehouseId,
} from '@/slices/InventoryCheckingSlice';
import { getAllWarehouseNotPaging, getWarehouseList } from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';
import {
  CloudUpload,
  Delete,
  Done,
  FileDownload,
  Info,
  InfoOutlined,
  Input,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import * as Yup from 'yup';
import LoadingButton from '@mui/lab/LoadingButton';
import AuthService from '@/services/authService';
import AlertPopup from '@/components/Common/AlertPopup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';

const useStyles = makeStyles((theme) => ({
  searchField: {
    width: '35%',
  },
  selectBox: {
    width: '100%',
  },
  table: {
    textAlign: 'center',
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody tr:hover': {
      // cursor: 'pointer',
    },
  },
  rowConsignment: {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    boxShadow: '15px',
  },
  tableCellConsignment: {
    padding: '0 !important',
  },
  tableCosignment: {
    // marginTop: '0',
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
    },
  },
  tableColumnIcon: {
    // maxWidth: '50px',
    padding: '15px 0 !important',
  },
  cardTable: {
    minHeight: '74vh',
    position: 'relative',
  },
  totalDifferentContainer: {
    minHeight: '100px',
    width: '35%',
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  tableContainer: {
    marginBottom: '150px',
  },
}));

const initialExportOrder = {
  createdDate: new Date(),
  description: '',
  productList: [
    // {
    //   id: 1,
    //   productCode: 'GACH23',
    //   productName: 'Gạch men 60x60',
    //   unitMeasure: 'Viên',
    //   wrapUnitMeasure: 'Viên',
    //   numberOfWrapUnitMeasure: 10,
    //   quantity: 0,
    //   unitPrice: 100000,
    //   consignments: [
    //     {
    //       id: 1,
    //       warehouseId: 1,
    //       warehourseName: 'Kho 1',
    //       importDate: '16/07/2022',
    //       expirationDate: '30/12/2022',
    //       quantity: '0',
    //       quantityInstock: '500',
    //     },
    //     {
    //       id: 2,
    //       warehouseId: 1,
    //       warehourseName: 'Kho 1',
    //       importDate: '20/07/2022',
    //       expirationDate: '30/12/2022',
    //       quantity: '0',
    //       quantityInstock: '1000',
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   productCode: 'GACH23',
    //   productName: 'Gạch men 60x60',
    //   unitMeasure: 'Viên',
    //   quantity: 0,
    //   unitPrice: 100000,
    //   consignments: [
    //     {
    //       id: 1,
    //       warehouseId: 1,
    //       warehourseName: 'Kho 1',
    //       importDate: '16/07/2022',
    //       expirationDate: '30/12/2022',
    //       quantity: '0',
    //       quantityInstock: '500',
    //     },
    //   ],
    // },
  ],
};

const CreateInventoryChecking = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [warehouseId, setWarehouseId] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileUploadName, setFileUploadName] = useState('');
  const [loadingButton, setIsLoadingButton] = useState(false);
  const classes = useStyles();
  const hiddenFileInput = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const { loading } = useSelector((state) => ({ ...state.inventoryChecking }));
  const warehouseState = useSelector((state) => ({ ...state.warehouse }));
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();

  const FORM_VALIDATION = Yup.object().shape({
    warehouseId: Yup.string().required('Bạn chưa chọn kho kiểm'),
  });

  // Create a reference to the hidden file input element

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClickImportExcel = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChangeFileExcel = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded.name);
    setFileUploadName(fileUploaded.name);
    const formData = new FormData();
    formData.append('file', fileUploaded);
  };

  const handleChangeWarehouse = (event) => {
    setProductList([]);
    if (event !== null) {
      fetchProductByWarehouseId(event.value.id);
      setSelectedProduct(null);
    }
  };

  const handleOnChangeProduct = async (e) => {
    setSelectedProduct(e);
    if (e !== null) {
      const isSelected = valueFormik.current.productList.some((element) => {
        // console.log('element 215',element)
        if (element.id === e.value.productId) {
          return true;
        }

        return false;
      });

      const productSelected = {
        productId: e.value.productId,
      };
      if (isSelected) {
        return;
      } else {
        // productSelected.consignments = consignmentList
        const product = await fetchConsignmentByProductId(productSelected.productId);
        arrayHelpersRef.current.push(product);
        // console.log('productList', valueFormik.current);
      }
    }
  };

  const handleSubmit = async (values, setSubmitting) => {
    setSubmitting(true);
    let listCheckingHistory = [];
    if (!!values.productList) {
      for (let index = 0; index < values.productList.length; index++) {
        const product = values.productList[index];
        const consignments = product.listConsignment;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          const consignment = consignments[indexConsignment];
          const realityQuantity =
            product.selectedUnitMeasure === product.unitMeasure
              ? consignment.realityQuantity
              : FormatDataUtils.getRoundFloorNumber(
                  consignment.realityQuantity * product.numberOfWrapUnitMeasure,
                );
          console.log(consignment.realityQuantity);
          if (realityQuantity === '') {
            setErrorMessage('Bạn có sản phẩm chưa nhập số lượng thực tế');
            setSubmitting(false);
            setOpenPopup(true);
            return;
          }

          // if (
          //   FormatDataUtils.getRoundFloorNumber(consignment.realityQuantity, 1) !==
          //   consignment.realityQuantity
          // ) {
          //   setErrorMessage(
          //     'Vui lòng nhập số lượng thực tế với chỉ 1 chữ số sau số thập phân',
          //   );
          //   setSubmitting(false)
          //   setOpenPopup(true);
          //   return;
          // }
          listCheckingHistory.push({
            consignmentId: consignment.id,
            instockQuantity: consignment.quantity,
            realityQuantity: realityQuantity,
            differentAmout: calculateTotalDifferentAmountOfConsignment(
              product,
              indexConsignment,
            ),
          });
        }
      }
    }
    if (listCheckingHistory.length > 0) {
      const inventoryChecking = {
        userId: user.id,
        wareHouseId: values.warehouseId,
        totalDifferentAmout: calculateTotalDifferentAmountOfOrder(),
        listCheckingHistoryDetailRequest: listCheckingHistory,
      };
      console.log(inventoryChecking);
      try {
        const response = await dispatch(createInventoryChecking(inventoryChecking));
        const resultResponse = unwrapResult(response);
        console.log('resultResponse', resultResponse);
        if (resultResponse) {
          setSubmitting(false);
          toast.success(resultResponse.data.message);
          navigate('/inventory-checking/list');
        }
      } catch (error) {
        setSubmitting(false);
        console.log('Failed to save inventoryChecking: ', error);
        toast.error('Tạo phiếu kiểm kho thất bại');
      }
    } else {
      setSubmitting(false);
      setErrorMessage(' Vui lòng chọn ít nhất 1 sản phẩm để xác nhận kiểm kho');
      setOpenPopup(true);
      return;
    }
  };

  const calculateTotalDifferentAmountOfConsignment = (product, indexConsignment) => {
    let totalDifferent = 0;
    if (!!product) {
      const quantity =
        product.selectedUnitMeasure === product.unitMeasure
          ? product.listConsignment[indexConsignment].quantity
          : FormatDataUtils.getRoundFloorNumber(
              product.listConsignment[indexConsignment].quantity /
                product.numberOfWrapUnitMeasure,
              2,
            );
      const realityQuantity =
        product.selectedUnitMeasure === product.unitMeasure
          ? product.listConsignment[indexConsignment].realityQuantity
          : FormatDataUtils.getRoundFloorNumber(
              product.listConsignment[indexConsignment].realityQuantity *
                product.numberOfWrapUnitMeasure,
            ) / product.numberOfWrapUnitMeasure;
      totalDifferent = FormatDataUtils.getRoundNumber(
        (realityQuantity - quantity) * product.unitPrice,
      );
    }
    return totalDifferent;
  };

  const calculateTotalDifferentAmountOfOrder = () => {
    let totalDifferentAmount = 0;
    if (valueFormik.current) {
      const productList = valueFormik.current.productList;
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const listConsignment = productList[index].listConsignment;
        for (
          let indexConsignment = 0;
          indexConsignment < listConsignment.length;
          indexConsignment++
        ) {
          totalDifferentAmount =
            totalDifferentAmount +
            calculateTotalDifferentAmountOfConsignment(product, indexConsignment);
        }
      }
    }
    return totalDifferentAmount;
  };

  const getAllWarehouse = async (keyword) => {
    try {
      const actionResult = await dispatch(getAllWarehouseNotPaging());
      const dataResult = unwrapResult(actionResult);
      console.log('warehouse list', dataResult.data);
      if (dataResult.data) {
        setWarehouseList(dataResult.data.warehouse);
      }
    } catch (error) {
      console.log('Failed to fetch warehouse list: ', error);
    }
  };

  // const loadWarehouseOptions = async (searchQuery, loadedOptions, { page }) => {
  //   try {
  //     const params = {
  //       pageIndex: page,
  //       // pageSize: rowsPerPage,
  //       // ...searchProductParams,
  //     };
  //     const actionResult = await dispatch(getWarehouseList());
  //     const dataResult = unwrapResult(actionResult);
  //     console.log('warehouse list', dataResult.data);
  //     if (dataResult.data) {
  //       setWarehouseList(dataResult.data.warehouse);
  //       return {
  //         options: dataResult.data.warehouse,
  //         hasMore: dataResult.data.warehouse.length >= 1,
  //         additional: {
  //           page: searchQuery ? 2 : page + 1,
  //         },
  //       };
  //     }
  //   } catch (error) {
  //     console.log('Failed to fetch product list instock: ', error);
  //   }
  // };

  const fetchProductByWarehouseId = async (warehouseId) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        warehouseId: warehouseId,
      };
      const actionResult = await dispatch(getProductByWarehouseId(warehouseId));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data.listProduct);
      }
    } catch (error) {
      console.log('Failed to fetch product list instock: ', error);
    }
  };

  const fetchConsignmentByProductId = async (productId) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        productId: productId,
      };
      const actionResult = await dispatch(getConsignmentByProductId(productId));
      const dataResult = unwrapResult(actionResult);
      console.log('consignment', dataResult);
      if (dataResult) {
        console.log('consignmenList', dataResult.data.product);
        const product = {
          ...dataResult.data.product,
          selectedUnitMeasure: dataResult.data.product.unitMeasure,
        };
        return product;
      }
    } catch (error) {
      console.log('Failed to fetch consignment list instock: ', error);
    }
  };

  useEffect(() => {
    getAllWarehouse();
  }, []);

  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialExportOrder}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form>
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
                    <Typography variant="h6">Chọn kho kiểm</Typography>
                    <Stack
                      direction="row"
                      py={2}
                      justifyContent="space-between"
                    >
                      <Box className={classes.selectBox}>
                        {warehouseList && (
                          <Box>
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn kho"
                              noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                              isClearable={true}
                              isSearchable={true}
                              isLoading={warehouseState.loading}
                              loadingMessage={() => <>Đang tìm kiếm kho...</>}
                              name="warehouse"
                              // value={warehouseId}
                              options={FormatDataUtils.getOption(warehouseList)}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              }}
                              onChange={(e) => {
                                setFieldValue('warehouseId', e?.value.id || '');
                                setFieldValue('productList', [], false);
                                handleChangeWarehouse(e);
                              }}
                            />
                            <FormHelperText
                              error={true}
                              className="error-text-helper"
                            >
                              {errors.warehouseId}
                            </FormHelperText>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              {/* <Grid
                xs={6}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">Chọn kho kiểm</Typography>
                    <Stack
                      direction="row"
                      py={2}
                      justifyContent="space-between"
                    >
                      <Box className={classes.selectBox}>
                        comment thang asyncPaginate nay di
                        <AsyncPaginate
                          value={warehouseId}
                          loadOptions={loadWarehouseOptions}
                          getOptionValue={(option) => option.id}
                          getOptionLabel={(option) => option.name}
                          noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                          onChange={(warehouseId) => {
                            setWarehouseId(warehouseId);
                            console.log(warehouseId);
                          }}
                          isSearchable={false}
                          placeholder="Chọn kho"
                          additional={{
                            page: 1,
                          }}
                        />
                        {warehouseList && (
                          <Box>
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn kho"
                              noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                              isClearable={true}
                              isSearchable={true}
                              isLoading={warehouseState.loading}
                              loadingMessage={() => <>Đang tìm kiếm kho...</>}
                              name="warehouse"
                              // value={warehouseId}
                              options={FormatDataUtils.getOption(warehouseList)}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              }}
                              onChange={(e) => {
                                setFieldValue('warehouseId', e?.value.id || '');
                                setFieldValue('productList', [], false);
                                handleChangeWarehouse(e);
                              }}
                            />
                            <FormHelperText
                              error={true}
                              className="error-text-helper"
                            >
                              {errors.warehouseId}
                            </FormHelperText>
                          </Box>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<FileDownload />}
                      >
                        Xuất phiếu
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid> */}
              {/* <Grid
                xs={6}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Nhập phiếu kiểm kho bằng bảng tính (file excel)
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      py={2}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<CloudUpload />}
                          onClick={handleClickImportExcel}
                        >
                          Nhập bảng tính
                        </Button>
                        <input
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          style={{ display: 'none' }}
                          ref={hiddenFileInput}
                          onChange={handleChangeFileExcel}
                          id="upload-file"
                          type="file"
                        />

                        <Typography>{fileUploadName}</Typography>
                      </Stack>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<Input />}
                      >
                        Nhập phiếu
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid> */}
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent className={classes.cardTable}>
                    <Typography variant="h6">Các sản phẩm kiểm kho</Typography>
                    <br />
                    {productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Chọn sản phẩm từ kho trên"
                        noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                        isClearable={true}
                        isSearchable={true}
                        isLoading={loading}
                        loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                        name="product"
                        value={selectedProduct}
                        options={FormatDataUtils.getOptionProduct(productList)}
                        // options={FormatDataUtils.getOption(productListDataTest)}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        onChange={(e) => handleOnChangeProduct(e)}
                      />
                    )}
                    <br />
                    <Divider />
                    <br />
                    <TableContainer className={classes.tableContainer}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tableColumnIcon}
                              align="center"
                            ></TableCell>
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            {/* <TableCell align="center">Số lượng</TableCell> */}
                            <TableCell align="center">Đơn giá</TableCell>
                            {/* <TableCell align="center">Thành tiền</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <FieldArray
                            name="productList"
                            render={(arrayHelpers) => {
                              arrayHelpersRef.current = arrayHelpers;
                              valueFormik.current = values;
                              return (
                                <>
                                  {values.productList.map((product, index) => (
                                    <Fragment key={index}>
                                      <TableRow
                                        // hover
                                        //   selected={islistProductselected}
                                        selected={false}
                                      >
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                          align="center"
                                        >
                                          <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                          >
                                            <Delete fontSize="inherit" />
                                          </IconButton>
                                        </TableCell>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{product?.productCode}</TableCell>
                                        <TableCell>{product?.name}</TableCell>
                                        <TableCell>
                                          {product?.wrapUnitMeasure == null ? (
                                            product?.unitMeasure
                                          ) : (
                                            <Stack
                                              direction="row"
                                              className={classes.selectBoxUnitMeasure}
                                            >
                                              <Select
                                                classNamePrefix="select"
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    `productList[${index}].selectedUnitMeasure`,
                                                    e.value.name,
                                                  );
                                                  // change quantity when change unitMeasure
                                                  if (
                                                    e.value.name !==
                                                    values.productList[index]
                                                      .selectedUnitMeasure
                                                  ) {
                                                    if (
                                                      e.value.name ===
                                                      values.productList[index]
                                                        .wrapUnitMeasure
                                                    ) {
                                                      // TODO: set value cho quantity của từng consignment trong product
                                                      let consingments =
                                                        values.productList[index]
                                                          .listConsignment;
                                                      for (
                                                        let indexConsignment = 0;
                                                        indexConsignment <
                                                        consingments.length;
                                                        indexConsignment++
                                                      ) {
                                                        const consignment =
                                                          consingments[indexConsignment];
                                                        // console.log('alo',consignment)
                                                        setFieldValue(
                                                          `productList[${index}].listConsignment[${indexConsignment}].realityQuantity`,
                                                          FormatDataUtils.getRoundFloorNumber(
                                                            consignment.realityQuantity /
                                                              e.value.number,
                                                            2,
                                                          ),
                                                        );
                                                      }
                                                    }

                                                    if (
                                                      e.value.name ===
                                                      values.productList[index]
                                                        .unitMeasure
                                                    ) {
                                                      // setFieldValue(
                                                      //   `productList[${index}].quantity`,
                                                      //   Math.round(
                                                      //     values.consignmentRequests[index]
                                                      //       .quantity *
                                                      //       values.consignmentRequests[index]
                                                      //         .numberOfWrapUnitMeasure,
                                                      //   ),
                                                      // );
                                                      let consingments =
                                                        values.productList[index]
                                                          .listConsignment;
                                                      for (
                                                        let indexConsignment = 0;
                                                        indexConsignment <
                                                        consingments.length;
                                                        indexConsignment++
                                                      ) {
                                                        const consignment =
                                                          consingments[indexConsignment];

                                                        setFieldValue(
                                                          `productList[${index}].listConsignment[${indexConsignment}].realityQuantity`,
                                                          FormatDataUtils.getRoundFloorNumber(
                                                            consignment.realityQuantity *
                                                              values.productList[index]
                                                                .numberOfWrapUnitMeasure,
                                                          ),
                                                        );
                                                      }
                                                    }
                                                  }
                                                  // change unitPrice when change unitMeasure
                                                  if (
                                                    values.productList[index].unitPrice >
                                                      0 &&
                                                    e.value.name !==
                                                      values.productList[index]
                                                        .selectedUnitMeasure
                                                  ) {
                                                    if (
                                                      e.value.name ===
                                                      values.productList[index]
                                                        .wrapUnitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `productList[${index}].unitPrice`,
                                                        FormatDataUtils.getRoundFloorNumber(
                                                          values.productList[index]
                                                            .unitPrice * e.value.number,
                                                        ),
                                                      );
                                                    }

                                                    if (
                                                      e.value.name ===
                                                      values.productList[index]
                                                        .unitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `productList[${index}].unitPrice`,
                                                        FormatDataUtils.getRoundFloorNumber(
                                                          values.productList[index]
                                                            .unitPrice /
                                                            values.productList[index]
                                                              .numberOfWrapUnitMeasure,
                                                        ),
                                                      );
                                                    }
                                                  }
                                                }}
                                                defaultValue={
                                                  FormatDataUtils.getOption([
                                                    {
                                                      number: 1,
                                                      name: product?.unitMeasure,
                                                    },
                                                    {
                                                      number:
                                                        product?.numberOfWrapUnitMeasure,
                                                      name: product?.wrapUnitMeasure,
                                                    },
                                                  ])[0]
                                                }
                                                options={FormatDataUtils.getOption([
                                                  {
                                                    number: 1,
                                                    name: product?.unitMeasure,
                                                  },
                                                  {
                                                    number:
                                                      product?.numberOfWrapUnitMeasure,
                                                    name: product?.wrapUnitMeasure,
                                                  },
                                                ])}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                  menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                  }),
                                                }}
                                              />
                                              {product.selectedUnitMeasure ===
                                                product.wrapUnitMeasure && (
                                                <TooltipUnitMeasure
                                                  wrapUnitMeasure={
                                                    product.wrapUnitMeasure
                                                  }
                                                  numberOfWrapUnitMeasure={
                                                    product.numberOfWrapUnitMeasure
                                                  }
                                                  unitMeasure={product.unitMeasure}
                                                  isConvert={false}
                                                />
                                              )}
                                            </Stack>
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.rowConsignment}>
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                        ></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className={classes.tableCellConsignment}
                                        >
                                          <Table className={classes.tableCosignment}>
                                            {/* <TableHead> */}

                                            {/* </TableHead> */}
                                            <TableBody>
                                              <TableRow>
                                                <TableCell align="center">
                                                  STT lô hàng
                                                </TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Hạn lưu kho</TableCell>
                                                <TableCell align="center">
                                                  Số lượng đầu
                                                </TableCell>
                                                <TableCell align="center">
                                                  Số lượng thực tế
                                                </TableCell>
                                                <TableCell align="center">
                                                  Giá trị chênh lệch
                                                </TableCell>
                                              </TableRow>
                                              {product?.listConsignment?.map(
                                                (consignment, indexConsignment) => (
                                                  <TableRow key={indexConsignment}>
                                                    <TableCell align="center">
                                                      {indexConsignment + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDateByFormat(
                                                        consignment?.importDate,'dd/MM/yyyy'
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDateByFormat(
                                                            consignment?.expirationDate,'dd/MM/yyyy'
                                                          )
                                                        : 'Không có'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {product.selectedUnitMeasure ===
                                                      product.unitMeasure ? (
                                                        consignment?.quantity
                                                      ) : (
                                                        <Stack
                                                          direction="row"
                                                          justifyContent="center"
                                                        >
                                                          {FormatDataUtils.getRoundFloorNumber(
                                                            consignment?.quantity /
                                                              product.numberOfWrapUnitMeasure,
                                                            2,
                                                          )}
                                                          {product.selectedUnitMeasure ===
                                                            product.wrapUnitMeasure && (
                                                            <TooltipUnitMeasure
                                                              quantity={
                                                                consignment?.quantity /
                                                                product.numberOfWrapUnitMeasure
                                                              }
                                                              wrapUnitMeasure={
                                                                product.wrapUnitMeasure
                                                              }
                                                              numberOfWrapUnitMeasure={
                                                                product.numberOfWrapUnitMeasure
                                                              }
                                                              unitMeasure={
                                                                product.unitMeasure
                                                              }
                                                              isConvert={true}
                                                            />
                                                          )}
                                                        </Stack>
                                                      )}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack direction='row'>
                                                      <TextfieldWrapper
                                                        name={`productList[${index}].listConsignment[${indexConsignment}].realityQuantity`}
                                                        variant="standard"
                                                        className="text-field-quantity"
                                                        type="number"
                                                        InputProps={{
                                                          inputProps: {
                                                            min: 0,
                                                            step:
                                                              product.selectedUnitMeasure ===
                                                              product.unitMeasure
                                                                ? 1
                                                                : 0.01,
                                                            // max: consignment?.quantity,
                                                          },
                                                        }}
                                                        // onChange={(e) => {
                                                        //   setFieldValue(
                                                        //     `productList[${index}].consignments[${indexConsignment}].quantity`,
                                                        //     e?.target.value,
                                                        //   );
                                                        // }}
                                                      />
                                                      {product.selectedUnitMeasure !==
                                                        product.unitMeasure && (
                                                        <TooltipUnitMeasure
                                                          quantity={
                                                            FormatDataUtils.getRoundFloorNumber(
                                                              consignment.realityQuantity *
                                                                product.numberOfWrapUnitMeasure,
                                                            ) /
                                                            product.numberOfWrapUnitMeasure
                                                          }
                                                          wrapUnitMeasure={
                                                            product.wrapUnitMeasure
                                                          }
                                                          numberOfWrapUnitMeasure={
                                                            product.numberOfWrapUnitMeasure
                                                          }
                                                          unitMeasure={
                                                            product.unitMeasure
                                                          }
                                                          isConvert={true}
                                                        />
                                                      )}</Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {FormatDataUtils.formatCurrency(
                                                        calculateTotalDifferentAmountOfConsignment(
                                                          product,
                                                          indexConsignment,
                                                        ),
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                      {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                      {/* <pre>{JSON.stringify(errors, null, 2)}</pre>
                      <pre>{JSON.stringify(isSubmitting, null, 2)}</pre> */}
                    </TableContainer>
                    <Box className={classes.totalDifferentContainer}>
                      <Divider />
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          p={2}
                          justifyContent="space-between"
                        >
                          <Typography className={classes.labelTotalDifferent}>
                            Tổng chênh lệch:
                          </Typography>
                          <Typography className={classes.totalDifferent}>
                            <b>
                              {FormatDataUtils.formatCurrency(
                                calculateTotalDifferentAmountOfOrder(),
                              )}
                            </b>
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                        >
                          <LoadingButton
                            variant="contained"
                            color="success"
                            startIcon={<Done />}
                            loading={isSubmitting}
                            loadingPosition="start"
                            type="submit"
                          >
                            Xác nhận kiểm kho
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <AlertPopup
              title="Chú ý"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <Box
                component={'span'}
                className="popup-message-container"
              >
                {errorMessage}
              </Box>
            </AlertPopup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreateInventoryChecking;
