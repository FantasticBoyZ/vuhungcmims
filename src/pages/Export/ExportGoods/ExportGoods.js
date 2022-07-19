import AlertPopup from '@/components/Common/AlertPopup';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import AuthService from '@/services/authService';
import {
  createExportOrder,
  getListConsiggnmentOfProductInStock,
  getListProductInStock,
} from '@/slices/ExportOrderSlice';
import FormatDataUtils from '@/utils/formatData';
import { Delete, Done } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
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
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const useStyles = makeStyles({
  cardInfo: { minHeight: '69vh' },
  cardTable: {
    minHeight: '90vh',
  },
  totalAmount: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent:'space-between'
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
  selectBoxUnitMeasure: {
    maxWidth: '90px',
  },
  buttonCreate: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const productListDataTest = [
  {
    id: 1,
    productCode: 'GACH23',
    name: 'Gạch men 60x60',
    unitMeasure: 'Viên',
    quantity: 0,
    unitPrice: 100000,
    consignments: [
      {
        id: 1,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '16/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '500',
      },
      {
        id: 2,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '20/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '1000',
      },
    ],
  },
  {
    id: 2,
    productCode: 'GACH33',
    name: 'Gạch men 30x30',
    unitMeasure: 'Viên',
    quantity: 0,
    unitPrice: 100000,
    consignments: [
      {
        id: 1,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '16/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '500',
      },
    ],
  },
];

const initialExportOrder = {
  billReferenceNumber: '',
  statusName: '',
  creatorId: '',
  createdDate: new Date(),
  description: '',
  productList: [
    // {
    //   id: 1,
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

const ExportGoods = () => {
  const [productList, setProductList] = useState();
  const [consignmentList, setConsignmentList] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const currentUser = AuthService.getCurrentUser();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const FORM_VALIDATION = Yup.object().shape({
    billReferenceNumber: Yup.string().required('Bạn chưa nhập mã phiếu tham chiếu'),
  });

  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();

  const classes = useStyles();

  const handleOnChangeProduct = async (e) => {
    const isSelected = valueFormik.current.productList.some((element) => {
      // console.log('element 215',element)
      if (element.productId === e.value.productId) {
        return true;
      }

      return false;
    });

    const productSelected = {
      productId: e.value.productId,
      productName: e.value.productName,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      wrapUnitMeasure: e.value.wrapUnitMeasure,
      numberOfWrapUnitMeasure: e.value.numberOfWrapUnitMeasure,
      expirationDate: null,
      quantity: '',
      unitPrice: e.value.unitPrice,
    };
    if (isSelected) {
      return;
    } else {
      // productSelected.consignments = consignmentList
      arrayHelpersRef.current.push(
        await fetchConsignmentOfProductInstock(
          productSelected.productId,
          productSelected,
        ),
      );
      // console.log('productList', valueFormik.current);
    }
  };

  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (product.consignments !== undefined && product.consignments?.length > 0) {
      product?.consignments.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return totalQuantity;
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (valueFormik.current !== undefined) {
      const productList = valueFormik.current.productList;

      if (productList?.length > 0) {
        productList.forEach((product) => {
          let totalQuantity = 0;
          if (product.consignments !== undefined && product.consignments?.length > 0) {
            product.consignments?.forEach((consignment) => {
              totalQuantity = +totalQuantity + +consignment.quantity;
            });
          }
          totalAmount = totalAmount + totalQuantity * product.unitPrice;
        });
      }
    }
    return totalAmount;
  };

  const handleSubmit = async (values) => {
    console.log('submit value', values);
    let productList = values.productList;
    let consignmentExports = [];
    if (productList.length === 0) {
      setErrorMessage(' Vui lòng chọn ít nhất 1 sản phẩm để xuất hàng');
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < productList.length; index++) {
      if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
        setErrorMessage('Bạn có sản phẩm chưa nhập số lượng');
        setOpenPopup(true);
        return;
      }
      // if (productList[index]?.quantity === 0) {
      //   setErrorMessage('Bạn không thể nhập sản phẩm với số lượng bằng 0');
      //   setOpenPopup(true);
      //   return;
      // }
      const consignments = productList[index]?.consignments;
      for (
        let indexConsignment = 0;
        indexConsignment < consignments.length;
        indexConsignment++
      ) {
        let consignment = consignments[indexConsignment];
        if (consignment.quantity > consignment.quantityInstock) {
          setErrorMessage(
            'Bạn không thể nhập số lượng lớn hơn số lượng tồn kho của lô hàng',
          );
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity < 0) {
          setErrorMessage('Bạn không thể nhập số lượng nhỏ hơn 0');
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity > 0) {
          consignmentExports.push({
            id: consignment.id,
            quantity: consignment.quantity,
            unitPrice: productList[index].unitPrice,
          });
        }
      }
    }
    const dataSubmit = {
      billReferenceNumber: values.billReferenceNumber,
      createdDate: new Date(
        today.getTime() - today.getTimezoneOffset() * 60 * 1000,
      ).toJSON(),
      description: values.description,
      userId: currentUser.id,
      consignmentExports: consignmentExports,
    };
    console.log('create new export', dataSubmit);
    if (consignmentExports.length > 0) {
      try {
        const response = await dispatch(createExportOrder(dataSubmit));
        const resultResponse = unwrapResult(response);
        if (resultResponse) {
          toast.success('Tạo phiếu xuất hàng thành công');
          console.log(resultResponse);
          navigate('/export/list');
        }
      } catch (error) {
        console.log('Failed to save export order: ', error);
        toast.error('Tạo phiếu xuất hàng thất bại');
      }
    } else {
      setErrorMessage('Bạn không có lô hàng nào thoả mãn điều kiện xuất hàng');
      setOpenPopup(true);
      return;
    }
  };

  const fetchProductInstock = async () => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        // ...searchProductParams,
      };
      const actionResult = await dispatch(getListProductInStock(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data);
      }
    } catch (error) {
      console.log('Failed to fetch product list instock: ', error);
    }
  };

  const fetchConsignmentOfProductInstock = async (productId, productSelected) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        productId: productId,
      };
      const actionResult = await dispatch(getListConsiggnmentOfProductInStock(params));
      const dataResult = unwrapResult(actionResult);
      console.log('consignment', dataResult);
      if (dataResult) {
        // setTotalRecord(dataResult.data.totalRecord);
        console.log('consignmenList', dataResult.productList?.consignmentList);
        // setConsignmentList(dataResult.productList?.consignmentList);
        productSelected.consignments = dataResult.productList?.consignmentList;
        return productSelected;
      }
    } catch (error) {
      console.log('Failed to fetch consignment list instock: ', error);
    }
  };

  useEffect(() => {
    fetchProductInstock();
  }, []);

  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialExportOrder}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={9}
                item
              >
                <Card className={classes.cardTable}>
                  <CardHeader title="Thông tin các sản phẩm" />
                  <CardContent>
                    {!!productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Chọn sản phẩm của nhà cung cấp phía trên..."
                        noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                        isClearable={true}
                        isSearchable={true}
                        isLoading={loading}
                        loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                        name="product"
                        //   value={selectedProduct}
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
                    <TableContainer>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableColumnIcon}></TableCell>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell colSpan={2}>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">Đơn giá</TableCell>
                            <TableCell align="center">Thành tiền</TableCell>
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
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{product?.productCode}</TableCell>
                                        <TableCell colSpan={2}>
                                          {product?.productName}
                                        </TableCell>
                                        <TableCell>
                                          {product?.wrapUnitMeasure == null ? (
                                            product?.unitMeasure
                                          ) : (
                                            <Box className={classes.selectBoxUnitMeasure}>
                                              <Select
                                                classNamePrefix="select"
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
                                            </Box>
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {calculateTotalQuantityOfProduct(product)}
                                          {/* {product?.quantity} */}
                                          {/* setFieldValue(`productList[${index}].quantity`, calculateTotalQuantityOfProduct(product) || 0) */}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            calculateTotalQuantityOfProduct(product) *
                                              product?.unitPrice,
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.rowConsignment}>
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                        ></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className={classes.tableCellConsignment}
                                        >
                                          <Table className={classes.tableCosignment}>
                                            {/* <TableHead> */}

                                            {/* </TableHead> */}
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>Vị trí</TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Hạn lưu kho</TableCell>
                                                <TableCell align="center">
                                                  Số lượng
                                                </TableCell>
                                                <TableCell align="center">
                                                  Tồn kho
                                                </TableCell>
                                              </TableRow>
                                              {product?.consignments?.map(
                                                (consignment, indexConsignment) => (
                                                  <TableRow key={indexConsignment}>
                                                    <TableCell>
                                                      {consignment?.warehouseName}
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDate(
                                                        consignment?.importDate,
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <TextfieldWrapper
                                                        name={`productList[${index}].consignments[${indexConsignment}].quantity`}
                                                        variant="standard"
                                                        className="text-field-quantity"
                                                        type={'number'}
                                                        InputProps={{
                                                          inputProps: {
                                                            min: 0,
                                                            max: consignment?.quantityInstock,
                                                          },
                                                        }}
                                                        // onChange={(e) => {
                                                        //   setFieldValue(
                                                        //     `productList[${index}].consignments[${indexConsignment}].quantity`,
                                                        //     e?.target.value,
                                                        //   );
                                                        // }}
                                                      />
                                                      {/* {consignment?.quantity} */}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {consignment?.quantityInstock}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                          className={classes.tableCellConsignment}
                                        ></TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                      {/* <pre>{JSON.stringify(errors, null, 2)}</pre>
                      <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={3}
                item
              >
                <Card>
                  <CardHeader title="Thông tin đơn xuất hàng" />
                  <CardContent className={classes.cardInfo}>
                    <Typography>{FormatDataUtils.formatDateTime(new Date())}</Typography>
                    <br />
                    <Typography>
                      <strong>Tham chiếu</strong> <IconRequired />
                    </Typography>
                    <TextfieldWrapper
                      id="referenceNumber"
                      name="billReferenceNumber"
                      variant="standard"
                      placeholder="Số mã phiếu..."
                      fullWidth
                    />
                    <br />
                    <br />
                    <Typography>
                      <strong>Ghi chú</strong>
                    </Typography>
                    <TextfieldWrapper
                      id="description"
                      name="description"
                      variant="outlined"
                      multiline
                      rows={10}
                      fullWidth
                    />
                  </CardContent>
                  <CardContent>
                    <Box className={classes.totalAmount}>
                      <Typography
                        variant="h5"
                        align="center"
                      >
                        Tổng tiền:
                      </Typography>
                      <Typography variant="h5">
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Box className={classes.buttonCreate}>
                      <ButtonWrapper
                        type="button"
                        variant="contained"
                        size="large"
                        startIcon={<Done />}
                        color="success"
                      >
                        Tạo phiếu xuất kho
                      </ButtonWrapper>
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

export default ExportGoods;
