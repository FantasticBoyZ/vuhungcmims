import FormatDataUtils from '@/utils/formatData';
import {
  Add,
  Close,
  Done,
  Edit,
  InfoOutlined,
  KeyboardReturn,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from 'react-router-dom';
import ExportProductTable from '@/pages/Transaction/ExportList/ExportOrderDetail/ExportProductTable';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConsignmentsByExportOrderId,
  getExportOrderById,
  updateExportOrder,
} from '@/slices/ExportOrderSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import AlertPopup from '@/components/Common/AlertPopup';
import { toast } from 'react-toastify';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  billReferenceContainer: {
    fontSize: '24px',
  },
  buttonAction: {},
  cardTable: {
    padding: theme.spacing(2),
    minHeight: '80vh',
  },
  confirmInfo: {},
  warehourseInfo: {},
  orderNote: {
    minHeight: '20vh',
  },
  totalAmount: {},
  table: {
    textAlign: 'center',
    // padding: theme.spacing(2),
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
  warehouseContainer: {
    backgroundColor: 'rgba(220, 244, 252,0.5)',
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
}));

const exportOrder = {
  billReferenceNumber: 'ABC1234',
  statusName: 'pending',
  creatorId: '1',
  creatorName: 'Obama',
  createdDate: new Date(),
  validator: 'Biden',
  confirmedDate: new Date(),
  warehourseId: '1',
  warehourseName: 'Kho 1',
  addressDetail: 'So 32 To 4',
  provinceId: 1,
  districtId: 1,
  wardId: 1,
  provinceName: 'Ha Noi',
  districtName: 'Chuong My',
  wardName: 'Xuan Mai',
  description:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  productList: [
    {
      id: 1,
      productCode: 'GACH23',
      productName: 'G???ch men 60x60',
      unitMeasure: 'Vi??n',
      quantity: '700',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantity: 20,
          quantityInStock: 200,
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantity: 30,
          quantityInStock: 500,
        },
      ],
    },
    {
      id: 2,
      productCode: 'GACH34',
      productName: 'G???ch men 60x60',
      unitMeasure: 'Vi??n',
      quantity: '1000',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantity: 20,
          quantityInStock: 200,
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantity: 50,
          quantityInStock: 800,
        },
      ],
    },
  ],
};

const UpdateExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  const [exportOrder, setExportOrder] = useState();
  const [productList, setProductList] = useState([]);
  const [addressWarehouse, setAddressWarehouse] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const valueFormik = useRef();
  const errorFormik = useRef();

  const FORM_VALIDATION = Yup.object().shape({
    description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???'),
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
      product?.consignmentList.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return FormatDataUtils.getRoundFloorNumber(totalQuantity, 2);
  };

  const calculateTotalQuantityOfProduct2 = (product) => {
    let totalQuantity = 0;
    if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
      product?.consignmentList.forEach((consignment) => {
        const quantity = product.selectedUnitMeasure
          ? product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                consignment.quantity * product.numberOfWrapUnitMeasure,
                1,
              )
            : consignment.quantity
          : FormatDataUtils.getRoundFloorNumber(consignment.quantity);
        totalQuantity = +totalQuantity + quantity;
      });
    }
    return product.selectedUnitMeasure
      ? product.selectedUnitMeasure !== product.unitMeasure
        ? FormatDataUtils.getRoundFloorNumber(
            totalQuantity / product.numberOfWrapUnitMeasure,
            2,
          )
        : totalQuantity
      : totalQuantity;
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = valueFormik.current.productList;
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const quantity = product.selectedUnitMeasure
          ? product.selectedUnitMeasure === product.unitMeasure
            ? calculateTotalQuantityOfProduct2(product)
            : FormatDataUtils.getRoundFloorNumber(
                calculateTotalQuantityOfProduct2(product) *
                  product.numberOfWrapUnitMeasure,
              )
          : calculateTotalQuantityOfProduct2(product);
        totalAmount = totalAmount + quantity * +product?.unitPrice;
      }
    }
    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setTitle('B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?');
    setMessage('H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.');
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };

  const handleOnClickCancel = () => {
    setTitle('B???n c?? ch???c ch???n mu???n h???y t???t c??? nh???ng ch???nh s???a kh??ng?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.productList;
      let consignmentExports = [];
      console.log('x??c nh???n', values);

      for (let index = 0; index < productList.length; index++) {
        if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
          setErrorMessage('B???n c?? s???n ph???m ch??a nh???p s??? l?????ng');
          setOpenPopup(true);
          return;
        }
        const consignments = productList[index]?.consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          let consignment = consignments[indexConsignment];
          const quantity = productList[index].selectedUnitMeasure
            ? productList[index].selectedUnitMeasure === productList[index].unitMeasure
              ? consignment.quantity
              : FormatDataUtils.getRoundFloorNumber(
                  consignment.quantity * productList[index].numberOfWrapUnitMeasure,
                )
            : consignment.quantity;
          if (quantity > consignment.quantityInstock) {
            setErrorMessage(
              'B???n kh??ng th??? nh???p s??? l?????ng l???n h??n s??? l?????ng t???n kho c???a l?? h??ng',
            );
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(quantity)) {
            setErrorMessage(
              'Vui l??ng nh???p s??? l?????ng s???n ph???m v???i ????n v??? nh??? nh???t l?? s??? nguy??n',
            );
            setOpenPopup(true);
            return;
          }

          if (quantity < 0) {
            setErrorMessage('B???n kh??ng th??? nh???p s??? l?????ng nh??? h??n 0');
            setOpenPopup(true);
            return;
          }
          if (quantity >= 0) {
            consignmentExports.push({
              id: consignment.id,
              quantity: quantity,
              unitPrice: productList[index].unitPrice,
            });
          }
        }
      }
      const editedExportOrder = {
        orderId: exportOrderId,
        billReferenceNumber: values.billRefernce,
        // createdDate: values.createDate,
        description: values.description,
        userId: values.userId,
        manufactorId: values.manufactorId,
        wareHouseId: values.wareHouseId,
        consignmentExports: consignmentExports,
      };
      if (consignmentExports.length > 0) {
        console.log(editedExportOrder);
        try {
          const response = await dispatch(updateExportOrder(editedExportOrder));
          const resultResponse = unwrapResult(response);
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success('S???a phi???u xu???t h??ng th??nh c??ng');
            }
            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log('Failed to save export order: ', error);
          toast.error('S???a phi???u xu???t h??ng th???t b???i');
        }
      } else {
        setErrorMessage('B???n kh??ng c?? l?? h??ng n??o tho??? m??n ??i???u ki???n xu???t h??ng');
        setOpenPopup(true);
        return;
      }
    } else {
      console.log('Hu???');
      navigate(`/export/detail/${exportOrderId}`);
    }
  };

  const fetchExportOrderDetail = async () => {
    try {
      // const params = {
      //   orderId: importOrderId,
      // };
      const actionResult = await dispatch(getExportOrderById(exportOrderId));
      const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.inforExportDetail)
      ) {
        setExportOrder(dataResult.data.inforExportDetail);

        if (dataResult.data.inforExportDetail?.statusName !== 'pending') {
          navigate(`/export/detail/${exportOrderId}`);
        }
      } else {
        navigate('/404');
      }
      console.log('Export Order Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch exportOrder detail: ', error);
    }
  };

  const fetchConsignmentsByExportOrderId = async () => {
    try {
      const params = {
        // pageIndex: page,
        // pageSize: rowsPerPage,
        orderId: exportOrderId,
      };
      const actionResult = await dispatch(getConsignmentsByExportOrderId(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setProductList(dataResult.data.productList);
        setAddressWarehouse(dataResult.data.addressWarehouse);
        // setTotalRecord(dataResult.data.totalRecord);
      }
      console.log('consignments List', dataResult);
    } catch (error) {
      console.log('Failed to fetch consignment list by exportOder: ', error);
    }
  };

  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate('/404');
    } else {
      fetchExportOrderDetail();
      fetchConsignmentsByExportOrderId();
    }
  }, []);
  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {!!exportOrder && productList.length > 0 && (
            <Formik
              initialValues={{ ...exportOrder, productList: [...productList] }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values) => handleConfirm(values)}
            >
              {({ values, errors, setFieldValue }) => {
                valueFormik.current = values;
                errorFormik.current = errors;
                return (
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
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            p={2}
                          >
                            <Box className={classes.billReferenceContainer}>
                              <Typography variant="span">
                                <strong>Phi???u xu???t kho s???:</strong>{' '}
                                {'XUAT' + exportOrderId}
                              </Typography>
                            </Box>
                            {exportOrder.statusName === 'pending' && (
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={2}
                                className={classes.buttonAction}
                              >
                                <Button
                                  variant="contained"
                                  startIcon={<Done />}
                                  color="warning"
                                  onClick={() => handleOnClickConfirm()}
                                >
                                  L??u ch???nh s???a
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<Close />}
                                  color="error"
                                  onClick={() => handleOnClickCancel()}
                                >
                                  Hu??? ch???nh s???a
                                </Button>
                              </Stack>
                            )}
                          </Stack>
                        </Card>
                      </Grid>
                      <Grid
                        xs={9}
                        item
                      >
                        <Grid
                          container
                          spacing={2}
                        >
                          {/* <Grid
            xs={12}
            item
          >
            <Card>Th??ng tin phi???u xu???t kho</Card>
          </Grid> */}
                          <Grid
                            xs={12}
                            item
                          >
                            <Card className={classes.cardTable}>
                              <TableContainer>
                                <Table className={classes.table}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>STT</TableCell>
                                      <TableCell>M?? s???n ph???m</TableCell>
                                      <TableCell>T??n s???n ph???m</TableCell>
                                      <TableCell>????n v???</TableCell>
                                      <TableCell align="center">S??? l?????ng</TableCell>
                                      <TableCell align="center">????n gi??</TableCell>
                                      <TableCell align="center">Th??nh ti???n</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {!!productList &&
                                      productList.length > 0 &&
                                      productList.map((product, index) => (
                                        <Fragment key={index}>
                                          <TableRow
                                            hover
                                            //   selected={islistProductselected}
                                            selected={false}
                                          >
                                            {/* TODO: S???a ph???n index khi ph??n trang */}
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{product?.productCode}</TableCell>
                                            <TableCell>{product?.productName}</TableCell>
                                            <TableCell>
                                              {product?.wrapUnitMeasure == null ? (
                                                product?.unitMeasure
                                              ) : (
                                                <Stack direction="row">
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
                                                    onChange={(e) => {
                                                      setFieldValue(
                                                        `productList[${index}].selectedUnitMeasure`,
                                                        e.value.name,
                                                      );
                                                      // change quantity when change unitMeasure
                                                      if (
                                                        values.productList[index]
                                                          .quantity > 0 &&
                                                        e.value.name !==
                                                          values.productList[index]
                                                            .selectedUnitMeasure
                                                      ) {
                                                        if (
                                                          e.value.name ===
                                                          values.productList[index]
                                                            .wrapUnitMeasure
                                                        ) {
                                                          const consignments =
                                                            values.productList[index]
                                                              .consignmentList;
                                                          for (
                                                            let indexConsignment = 0;
                                                            indexConsignment <
                                                            consignments.length;
                                                            indexConsignment++
                                                          ) {
                                                            const consignment =
                                                              consignments[
                                                                indexConsignment
                                                              ];
                                                            setFieldValue(
                                                              `productList[${index}].consignmentList[${indexConsignment}].quantity`,
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
                                                              .unitMeasure &&
                                                          !!values.productList[index]
                                                            .selectedUnitMeasure
                                                        ) {
                                                          const consignments =
                                                            values.productList[index]
                                                              .consignmentList;
                                                          for (
                                                            let indexConsignment = 0;
                                                            indexConsignment <
                                                            consignments.length;
                                                            indexConsignment++
                                                          ) {
                                                            const consignment =
                                                              consignments[
                                                                indexConsignment
                                                              ];

                                                            setFieldValue(
                                                              `productList[${index}].consignmentList[${indexConsignment}].quantity`,
                                                              FormatDataUtils.getRoundFloorNumber(
                                                                consignment.quantity *
                                                                  values.productList[
                                                                    index
                                                                  ]
                                                                    .numberOfWrapUnitMeasure,
                                                              ),
                                                            );
                                                          }
                                                        }
                                                      }
                                                    }}
                                                  />
                                                  {values.productList[index]
                                                    .selectedUnitMeasure ===
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
                                              {calculateTotalQuantityOfProduct2(
                                                values.productList[index],
                                              )}

                                              {values.productList[index]
                                                .selectedUnitMeasure ===
                                                product.wrapUnitMeasure &&
                                                !!product.wrapUnitMeasure && (
                                                  <Tooltip
                                                    title={
                                                      calculateTotalQuantityOfProduct2(
                                                        values.productList[index],
                                                      ) -
                                                      (calculateTotalQuantityOfProduct2(
                                                        values.productList[index],
                                                      ) %
                                                        1) +
                                                      ' ' +
                                                      product.wrapUnitMeasure +
                                                      ' ' +
                                                      Math.round(
                                                        (calculateTotalQuantityOfProduct2(
                                                          values.productList[index],
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
                                              {values.productList[index]
                                                .selectedUnitMeasure ===
                                              product.wrapUnitMeasure
                                                ? FormatDataUtils.formatCurrency(
                                                    product?.unitPrice *
                                                      product.numberOfWrapUnitMeasure,
                                                  )
                                                : FormatDataUtils.formatCurrency(
                                                    product?.unitPrice,
                                                  )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {FormatDataUtils.formatCurrency(
                                                (values.productList[index]
                                                  .selectedUnitMeasure ===
                                                product.wrapUnitMeasure
                                                  ? FormatDataUtils.getRoundFloorNumber(
                                                      calculateTotalQuantityOfProduct2(
                                                        values.productList[index],
                                                      ) * product.numberOfWrapUnitMeasure,
                                                    )
                                                  : calculateTotalQuantityOfProduct2(
                                                      values.productList[index],
                                                    )) * product.unitPrice,
                                              )}
                                            </TableCell>
                                          </TableRow>
                                          <TableRow className={classes.rowConsignment}>
                                            <TableCell
                                              className={classes.tableCellConsignment}
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
                                                  {product?.consignmentList.map(
                                                    (consignment, indexConsignment) => (
                                                      <TableRow
                                                        key={indexConsignment}
                                                        // hover
                                                      >
                                                        <TableCell>
                                                          {consignment?.warehouseName}
                                                        </TableCell>
                                                        <TableCell>
                                                          {consignment?.importDate &&
                                                            FormatDataUtils.formatDateTime(
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
                                                          <Stack
                                                            direction="row"
                                                            justifyContent="center"
                                                          >
                                                            <TextfieldWrapper
                                                              name={`productList[${index}].consignmentList[${indexConsignment}].quantity`}
                                                              variant="standard"
                                                              className="text-field-quantity"
                                                              type={'number'}
                                                              InputProps={{
                                                                inputProps: {
                                                                  min: 0,
                                                                  max:
                                                                    values.productList[
                                                                      index
                                                                    ]
                                                                      .selectedUnitMeasure !==
                                                                    product.wrapUnitMeasure
                                                                      ? consignment?.quantityInstock
                                                                      : FormatDataUtils.getRoundFloorNumber(
                                                                          consignment?.quantityInstock /
                                                                            product.numberOfWrapUnitMeasure,
                                                                          2,
                                                                        ),
                                                                  step:
                                                                    values.productList[
                                                                      index
                                                                    ]
                                                                      .selectedUnitMeasure !==
                                                                    product.wrapUnitMeasure
                                                                      ? 1
                                                                      : 0.01,
                                                                },
                                                              }}
                                                              // onChange={(e) => {
                                                              //   setFieldValue(
                                                              //     `productList[${index}].consignments[${indexConsignment}].quantityReturn`,
                                                              //     e?.target.value,
                                                              //   );
                                                              // }}
                                                            />
                                                            {values.productList[index]
                                                              .selectedUnitMeasure ===
                                                              product.wrapUnitMeasure &&
                                                              !!product.wrapUnitMeasure && (
                                                                <TooltipUnitMeasure
                                                                  quantity={
                                                                    FormatDataUtils.getRoundFloorNumber(
                                                                      values.productList[
                                                                        index
                                                                      ].consignmentList[
                                                                        indexConsignment
                                                                      ].quantity *
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
                                                          {values.productList[index]
                                                            .selectedUnitMeasure ===
                                                          product.wrapUnitMeasure
                                                            ? FormatDataUtils.getRoundFloorNumber(
                                                                consignment?.quantityInstock /
                                                                  product.numberOfWrapUnitMeasure,
                                                                2,
                                                              )
                                                            : consignment?.quantityInstock}
                                                          {values.productList[index]
                                                            .selectedUnitMeasure ===
                                                            product.wrapUnitMeasure &&
                                                            !!product.wrapUnitMeasure && (
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
                                            <TableCell
                                              className={classes.tableCellConsignment}
                                            ></TableCell>
                                          </TableRow>
                                        </Fragment>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        xs={3}
                        item
                      >
                        <Grid
                          container
                          spacing={2}
                        >
                          <Grid
                            xs={12}
                            item
                          >
                            <Card>
                              <CardContent className={classes.confirmInfo}>
                                <Typography variant="h6">Th??ng tin x??c nh???n</Typography>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography>
                                      Ng?????i t???o ????n:{' '}
                                      <i>
                                        {exportOrder.createdFullName +
                                          '(' +
                                          exportOrder.createBy +
                                          ')'}
                                      </i>
                                    </Typography>
                                    <Typography>Ng??y t???o ????n:</Typography>
                                    <Typography>
                                      {FormatDataUtils.formatDateTime(
                                        exportOrder.createDate,
                                      )}
                                    </Typography>
                                  </Box>
                                  <Typography>
                                    Tham chi???u: <i>{exportOrder.billRefernce}</i>
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid
                            xs={12}
                            item
                          >
                            <Card>
                              <CardContent className={classes.warehourseInfo}>
                                <Typography variant="h6">Kho l???y h??ng</Typography>
                                <Stack spacing={2}>
                                  {addressWarehouse.length > 0 &&
                                    addressWarehouse.map((address) => (
                                      <Box
                                        key={address.id}
                                        className={classes.warehouseContainer}
                                      >
                                        <Typography>{address.name}</Typography>
                                        <Divider />
                                        <Typography>{address.detailAddress}</Typography>
                                        <Typography>
                                          {address.wardName} - {address.districtName} -{' '}
                                          {address.provinceName}
                                        </Typography>
                                      </Box>
                                    ))}
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid
                            xs={12}
                            item
                          >
                            <Card>
                              {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="T???ng gi?? tr??? ????n h??ng"
                /> */}
                              <CardContent className={classes.orderNote}>
                                <Typography variant="h6">Ghi ch??</Typography>
                                <TextfieldWrapper
                                  id="description"
                                  name="description"
                                  variant="outlined"
                                  multiline
                                  rows={6}
                                  fullWidth
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid
                            xs={12}
                            item
                          >
                            <Card>
                              <CardContent className={classes.totalAmount}>
                                {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="T???ng gi?? tr??? ????n h??ng"
                /> */}
                                <Typography variant="h6">
                                  T???ng gi?? tr??? ????n h??ng
                                </Typography>
                                <br />
                                <Typography align="right">
                                  {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                      <AlertPopup
                        maxWidth="sm"
                        title={errorMessage ? 'Ch?? ??' : title}
                        openPopup={openPopup}
                        setOpenPopup={setOpenPopup}
                        isConfirm={!errorMessage}
                        handleConfirm={handleConfirm}
                      >
                        <Box
                          component={'span'}
                          className="popupMessageContainer"
                        >
                          {errorMessage ? errorMessage : message}
                        </Box>
                      </AlertPopup>
                      {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Box>
      )}
    </>
  );
};

export default UpdateExportOrderDetail;
