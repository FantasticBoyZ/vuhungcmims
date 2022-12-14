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
import { Delete, Done, InfoOutlined } from '@mui/icons-material';
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
  Tooltip,
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
import LoadingButton from '@mui/lab/LoadingButton';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';

const useStyles = makeStyles({
  cardInfo: { minHeight: '69vh' },
  cardTable: {
    minHeight: '90vh',
  },
  totalAmount: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
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
    maxWidth: '150px',
  },
  buttonCreate: {
    display: 'flex',
    justifyContent: 'center',
  },
  unitMeasureSelect: {
    width: '100px',
  },
});

const productListDataTest = [
  {
    id: 1,
    productCode: 'GACH23',
    name: 'G???ch men 60x60',
    unitMeasure: 'Vi??n',
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
    name: 'G???ch men 30x30',
    unitMeasure: 'Vi??n',
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
    //   productName: 'G???ch men 60x60',
    //   unitMeasure: 'Vi??n',
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
    //   productName: 'G???ch men 60x60',
    //   unitMeasure: 'Vi??n',
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
  const [productList, setProductList] = useState([]);
  const [consignmentList, setConsignmentList] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const currentUser = AuthService.getCurrentUser();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const FORM_VALIDATION = Yup.object().shape({
    // billReferenceNumber: Yup.string().required('B???n ch??a nh???p m?? phi???u tham chi???u'),
    description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???'),
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
    console.log('alo', e);
    const productSelected = {
      productId: e.value.productId,
      productName: e.value.productName,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      wrapUnitMeasure: e.value.wrapUnitMeasure,
      numberOfWrapUnitMeasure: e.value.numberOfWrapUnitMeasure,
      expirationDate: e.value.expirationDate,
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
    return FormatDataUtils.getRoundFloorNumber(totalQuantity, 2);
  };

  const calculateTotalQuantityOfProduct2 = (product) => {
    let totalQuantity = 0;
    if (product.consignments !== undefined && product.consignments?.length > 0) {
      product?.consignments.forEach((consignment) => {
        const quantity =
          product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                consignment.quantity * product.numberOfWrapUnitMeasure,
              )
            : consignment.quantity;
        totalQuantity = +totalQuantity + quantity;
      });
    }
    return product.selectedUnitMeasure !== product.unitMeasure
      ? FormatDataUtils.getRoundFloorNumber(
          totalQuantity / product.numberOfWrapUnitMeasure,
          2,
        )
      : totalQuantity;
  };

  const calculateTotalAmountOfProduct = (product) => {
    let totalAmount = 0;

    if (product !== undefined && product?.consignments?.length > 0) {
      product?.consignments.forEach((consignment) => {
        let quantity =
          product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                consignment.quantity * product.numberOfWrapUnitMeasure,
              )
            : consignment.quantity;
        let unitPrice =
          product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                product.unitPrice / product.numberOfWrapUnitMeasure,
              )
            : product.unitPrice;
        // console.log('quantity',quantity,unitPrice)
        totalAmount = +totalAmount + +quantity * +unitPrice;
      });
    }
    return totalAmount;
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
              const quantity =
                product.selectedUnitMeasure !== product.unitMeasure
                  ? FormatDataUtils.getRoundFloorNumber(
                      consignment.quantity * product.numberOfWrapUnitMeasure,
                    )
                  : consignment.quantity;
              totalQuantity = +totalQuantity + quantity;
            });
          }
          const unitPrice =
            product.selectedUnitMeasure !== product.unitMeasure
              ? FormatDataUtils.getRoundFloorNumber(
                  product.unitPrice / product.numberOfWrapUnitMeasure,
                )
              : product.unitPrice;
          totalAmount = totalAmount + totalQuantity * unitPrice;
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
      setErrorMessage(' Vui l??ng ch???n ??t nh???t 1 s???n ph???m ????? xu???t h??ng');
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < productList.length; index++) {
      if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
        setErrorMessage('B???n c?? s???n ph???m ch??a nh???p s??? l?????ng');
        setOpenPopup(true);
        return;
      }

      const product = productList[index];
      const consignments = productList[index]?.consignments;
      for (
        let indexConsignment = 0;
        indexConsignment < consignments.length;
        indexConsignment++
      ) {
        let consignment = consignments[indexConsignment];
        // if (!Number.isInteger(consignment.quantity)) {
        //   setErrorMessage('Vui l??ng nh???p s??? l?????ng s???n ph???m l?? s??? nguy??n');
        //   setOpenPopup(true);
        //   return;
        // }
        if (consignment.quantity > consignment.quantityInstock) {
          setErrorMessage(
            'B???n kh??ng th??? nh???p s??? l?????ng l???n h??n s??? l?????ng t???n kho c???a l?? h??ng',
          );
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity < 0) {
          setErrorMessage('B???n kh??ng th??? nh???p s??? l?????ng nh??? h??n 0');
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity > 0) {
          consignmentExports.push({
            id: consignment.id,
            quantity: product.selectedUnitMeasure
              ? product.selectedUnitMeasure === product.unitMeasure
                ? consignment.quantity
                : FormatDataUtils.getRoundFloorNumber(
                    consignment.quantity * product.numberOfWrapUnitMeasure,
                  )
              : consignment.quantity,
            unitPrice: product.selectedUnitMeasure
              ? product.selectedUnitMeasure === product.unitMeasure
                ? product.unitPrice
                : FormatDataUtils.getRoundFloorNumber(
                    product.unitPrice / product.numberOfWrapUnitMeasure,
                  )
              : product.unitPrice,
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
          toast.success('T???o phi???u xu???t h??ng th??nh c??ng');
          console.log(resultResponse);
          navigate('/export/list');
        }
      } catch (error) {
        console.log('Failed to save export order: ', error);
        toast.error('T???o phi???u xu???t h??ng th???t b???i');
      }
    } else {
      setErrorMessage('B???n kh??ng c?? l?? h??ng n??o tho??? m??n ??i???u ki???n xu???t h??ng');
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
        productSelected = dataResult.productList;
        productSelected.consignments = dataResult.productList?.consignmentList;
        productSelected.selectedUnitMeasure = dataResult.productList.unitMeasure;
        delete productSelected.consignmentList;
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
                  <CardHeader title="Th??ng tin c??c s???n ph???m" />
                  <CardContent>
                    {!!productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Ch???n s???n ph???m..."
                        noOptionsMessage={() => <>Kh??ng c?? t??m th???y s???n ph???m n??o</>}
                        isClearable={true}
                        isSearchable={true}
                        isLoading={loading}
                        loadingMessage={() => <>??ang t??m ki???m s???n ph???m...</>}
                        name="product"
                        value={null}
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
                            <TableCell>M?? s???n ph???m</TableCell>
                            <TableCell colSpan={2}>T??n s???n ph???m</TableCell>
                            <TableCell>????n v???</TableCell>
                            <TableCell align="center">S??? l?????ng</TableCell>
                            <TableCell align="center">????n gi??</TableCell>
                            <TableCell align="center">Th??nh ti???n</TableCell>
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
                                            <Stack
                                              direction="row"
                                              className={classes.selectBoxUnitMeasure}
                                            >
                                              <Select
                                                className={classes.unitMeasureSelect}
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
                                                      // TODO: set value cho quantity c???a t???ng consignment trong product
                                                      let consingments =
                                                        values.productList[index]
                                                          .consignments;
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
                                                          `productList[${index}].consignments[${indexConsignment}].quantity`,
                                                          FormatDataUtils.getRoundFloorNumber(
                                                            consignment.quantity /
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
                                                          .consignments;
                                                      for (
                                                        let indexConsignment = 0;
                                                        indexConsignment <
                                                        consingments.length;
                                                        indexConsignment++
                                                      ) {
                                                        const consignment =
                                                          consingments[indexConsignment];

                                                        setFieldValue(
                                                          `productList[${index}].consignments[${indexConsignment}].quantity`,
                                                          FormatDataUtils.getRoundFloorNumber(
                                                            consignment.quantity *
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
                                          {FormatDataUtils.getRoundFloorNumber(
                                            calculateTotalQuantityOfProduct2(product),
                                            product.selectedUnitMeasure !==
                                              product.unitMeasure
                                              ? 2
                                              : 0,
                                          )}

                                          {/* {product?.quantity} */}
                                          {product.selectedUnitMeasure !==
                                            product.unitMeasure && (
                                            <Tooltip
                                              title={
                                                calculateTotalQuantityOfProduct2(
                                                  product,
                                                ) -
                                                (calculateTotalQuantityOfProduct2(
                                                  product,
                                                ) %
                                                  1) +
                                                ' ' +
                                                product.wrapUnitMeasure +
                                                ' ' +
                                                Math.round(
                                                  (calculateTotalQuantityOfProduct2(
                                                    product,
                                                  ) %
                                                    1) *
                                                    product.numberOfWrapUnitMeasure,
                                                ) +
                                                ' ' +
                                                product.unitMeasure
                                              }
                                            >
                                              <IconButton>
                                                <InfoOutlined />
                                              </IconButton>
                                            </Tooltip>
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {/* {FormatDataUtils.formatCurrency(
                                            product.selectedUnitMeasure !==
                                              product.unitMeasure
                                              ? FormatDataUtils.getRoundFloorNumber(
                                                  calculateTotalQuantityOfProduct(
                                                    product,
                                                  ) * product.numberOfWrapUnitMeasure,
                                                ) *
                                                  FormatDataUtils.getRoundFloorNumber(
                                                    product?.unitPrice /
                                                      product.numberOfWrapUnitMeasure,
                                                  )
                                              : calculateTotalQuantityOfProduct(product) *
                                                  product?.unitPrice,
                                          )} */}
                                          {FormatDataUtils.formatCurrency(
                                            calculateTotalAmountOfProduct(
                                              values.productList[index],
                                            ),
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
                                                <TableCell>V??? tr??</TableCell>
                                                <TableCell>Ng??y nh???p</TableCell>
                                                <TableCell>H???n l??u kho</TableCell>
                                                <TableCell align="center">
                                                  S??? l?????ng
                                                </TableCell>
                                                <TableCell align="center">
                                                  T???n kho
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
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDate(
                                                            consignment?.expirationDate,
                                                          )
                                                        : 'Kh??ng c??'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack direction="row" justifyContent='center'>
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].consignments[${indexConsignment}].quantity`}
                                                          variant="standard"
                                                          className="text-field-quantity"
                                                          type={'number'}
                                                          InputProps={{
                                                            inputProps: {
                                                              min: 0,
                                                              max:
                                                                product.selectedUnitMeasure ===
                                                                product.unitMeasure
                                                                  ? consignment?.quantityInstock
                                                                  : FormatDataUtils.getRoundFloorNumber(
                                                                      consignment?.quantityInstock /
                                                                        product.numberOfWrapUnitMeasure,
                                                                      2,
                                                                    ),
                                                              step:
                                                                product.selectedUnitMeasure ===
                                                                product.unitMeasure
                                                                  ? 1
                                                                  : 0.01,
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
                                                                consignment.quantity *
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
                                                        )}
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {product.selectedUnitMeasure ===
                                                      product.unitMeasure
                                                        ? consignment?.quantityInstock
                                                        : FormatDataUtils.getRoundFloorNumber(
                                                            consignment?.quantityInstock /
                                                              product.numberOfWrapUnitMeasure,
                                                            2,
                                                          )}
                                                      {product.selectedUnitMeasure !==
                                                        product.unitMeasure && (
                                                        <Tooltip
                                                          title={
                                                            consignment?.quantityInstock /
                                                              product.numberOfWrapUnitMeasure -
                                                            ((consignment?.quantityInstock /
                                                              product.numberOfWrapUnitMeasure) %
                                                              1) +
                                                            ' ' +
                                                            product.wrapUnitMeasure +
                                                            ' ' +
                                                            Math.floor(
                                                              ((consignment?.quantityInstock /
                                                                product.numberOfWrapUnitMeasure) %
                                                                1) *
                                                                product.numberOfWrapUnitMeasure,
                                                            ) +
                                                            ' ' +
                                                            product.unitMeasure
                                                          }
                                                        >
                                                          <IconButton>
                                                            <InfoOutlined />
                                                          </IconButton>
                                                        </Tooltip>
                                                      )}
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
                      {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                      {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={3}
                item
              >
                <Card>
                  <CardHeader title="Th??ng tin ????n xu???t h??ng" />
                  <CardContent className={classes.cardInfo}>
                    <Typography>{FormatDataUtils.formatDateTime(new Date())}</Typography>
                    <br />
                    <Typography>
                      <strong>Tham chi???u</strong>
                    </Typography>
                    <TextfieldWrapper
                      id="referenceNumber"
                      name="billReferenceNumber"
                      variant="standard"
                      placeholder="S??? m?? phi???u..."
                      fullWidth
                    />
                    <br />
                    <br />
                    <Typography>
                      <strong>Ghi ch??</strong>
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
                        T???ng ti???n:
                      </Typography>
                      <Typography variant="h5">
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Box className={classes.buttonCreate}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loading && !errors}
                        loadingPosition="start"
                        startIcon={<Done />}
                        color="success"
                      >
                        T???o phi???u xu???t kho
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <AlertPopup
              title="Ch?? ??"
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
