import FormatDataUtils from '@/utils/formatData';
import { Add, Close, Edit, InfoOutlined, KeyboardReturn } from '@mui/icons-material';
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
  createReturnOrder,
  getConsignmentsByExportOrderId,
  getExportOrderById,
} from '@/slices/ExportOrderSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import AlertPopup from '@/components/Common/AlertPopup';
import { toast } from 'react-toastify';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';
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
  statusName: 'completed',
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
      productName: 'Gạch men 60x60',
      unitMeasure: 'Viên',
      quantity: '700',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 0,
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 0,
          quantity: '500',
        },
      ],
    },
    {
      id: 2,
      productCode: 'GACH34',
      productName: 'Gạch men 60x60',
      unitMeasure: 'Viên',
      quantity: '1000',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 0,
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 0,
          quantity: '800',
        },
      ],
    },
  ],
};

const ReturnGoods = () => {
  const { exportOrderId } = useParams();
  const [exportOrder, setExportOrder] = useState();
  const [productList, setProductList] = useState([]);
  const [addressWarehouse, setAddressWarehouse] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const valueFormik = useRef();
  const errorFormik = useRef();
  // const productList = exportOrder.productList;
  const FORM_VALIDATION = Yup.object().shape({
    description: Yup.string().max(255, 'Mô tả không thể dài quá 255 kí tự'),
  });

  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  // const calculateTotalAmount = () => {
  //   let totalAmount = 0;
  //   const productList = valueFormik.current.productList;
  //   // console.log(valueFormik.current.productList);
  //   if (productList) {
  //     for (let index = 0; index < productList.length; index++) {
  //       totalAmount =
  //         totalAmount +
  //         calculateTotalQuantityOfProduct(productList[index]) *
  //           +productList[index]?.unitPrice;
  //     }
  //   }
  //   return totalAmount;
  // };

  // const calculateTotalQuantityOfProduct = (product) => {
  //   let totalQuantity = 0;
  //   if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
  //     product?.consignmentList.forEach((consignment) => {
  //       totalQuantity = +totalQuantity + +consignment.quantityReturn;
  //     });
  //   }
  //   return totalQuantity;
  // };

  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
      product?.consignmentList.forEach((consignment) => {
        const quantity = product.selectedUnitMeasure
          ? product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                consignment.quantityReturn * product.numberOfWrapUnitMeasure,
              )
            : consignment.quantityReturn
          : consignment.quantityReturn;
        totalQuantity = +totalQuantity + quantity;
      });
    }
    return product.selectedUnitMeasure
      ? product.selectedUnitMeasure !== product.unitMeasure
        ? FormatDataUtils.getRoundNumber(
            totalQuantity / product.numberOfWrapUnitMeasure,
            2,
          )
        : FormatDataUtils.getRoundFloorNumber(totalQuantity)
      : FormatDataUtils.getRoundFloorNumber(totalQuantity);
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = valueFormik.current.productList;
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const quantity = product.selectedUnitMeasure
          ? product.selectedUnitMeasure === product.unitMeasure
            ? calculateTotalQuantityOfProduct(product)
            : FormatDataUtils.getRoundFloorNumber(
                calculateTotalQuantityOfProduct(product) *
                  product.numberOfWrapUnitMeasure,
              )
          : calculateTotalQuantityOfProduct(product);
        totalAmount = totalAmount + quantity * +product?.unitPrice;
      }
    }
    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setTitle('Bạn có chắc chắn muốn xác nhận trả hàng không?');
    setMessage('');
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy trả hàng không?');
    setMessage('');
    setErrorMessage(null);
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.productList;
      let consignmentReturns = [];
      console.log('xác nhận', values);

      for (let index = 0; index < productList.length; index++) {
        const consignments = productList[index]?.consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          let consignment = consignments[indexConsignment];
          const quantityReturn = !!productList[index].selectedUnitMeasure
            ? productList[index].selectedUnitMeasure === productList[index].unitMeasure
              ? consignment.quantityReturn
              : FormatDataUtils.getRoundFloorNumber(
                  consignment.quantityReturn * productList[index].numberOfWrapUnitMeasure,
                )
            : consignment.quantityReturn;
          if (consignment.quantityReturn > consignment.quantity) {
            setErrorMessage(
              'Bạn không thể trả về số lượng lớn hơn số lượng trên đơn hàng',
            );
            setOpenPopup(true);
            return;
          }
          if (consignment.quantityReturn < 0) {
            setErrorMessage('Bạn không thể nhập số lượng nhỏ hơn 0');
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(quantityReturn)) {
            setErrorMessage(
              'Vui lòng nhập số lượng trả về với đơn vị nhỏ nhất là số nguyên',
            );
            setOpenPopup(true);
            return;
          }

          if (consignment.quantityReturn > 0) {
            consignmentReturns.push({
              id: consignment.id,
              productId: productList[index].productId,
              quantity: quantityReturn,
              unitPrice: productList[index].unitPrice,
            });
          }
        }
      }
      const returnOrder = {
        billReferenceNumber: 'XUAT' + exportOrderId,
        createdDate: new Date().toJSON(),
        description: values.description,
        userId: values.userId,
        consignmentReturns: consignmentReturns,
      };
      console.log('return', returnOrder);
      if (consignmentReturns.length > 0) {
        try {
          const params = {
            returnOrder: returnOrder,
            exportOrderId: exportOrderId,
          };
          const response = await dispatch(createReturnOrder(params));
          const resultResponse = unwrapResult(response);
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success('Tạo phiếu trả hàng thành công');
            }
            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log('Failed to save return order: ', error);
          toast.error('Tạo phiếu trả hàng thất bại');
        }
      } else {
        setErrorMessage('Bạn không thể trả hàng nếu không có bất kì số lượng trả về nào');
        setOpenPopup(true);
        return;
      }
    } else {
      console.log('Huỷ');
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
      if (dataResult.data) {
        setExportOrder(dataResult.data.inforExportDetail);
        if (dataResult.data.inforExportDetail?.statusName !== 'completed') {
          navigate(`/export/detail/${exportOrderId}`);
        }
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
    fetchExportOrderDetail();
    fetchConsignmentsByExportOrderId();
  }, []);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {!!exportOrder && productList.length > 0 && (
            <Formik
              initialValues={{
                ...exportOrder,
                productList: [...productList],
              }}
              validationSchema={FORM_VALIDATION}
              // onSubmit={(values) => handleSubmit(values)}
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
                                <strong>Phiếu xuất kho số:</strong> {'XUAT' + exportOrderId}
                              </Typography>
                            </Box>
                            {exportOrder.statusName === 'completed' && (
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={2}
                                className={classes.buttonAction}
                              >
                                <Button
                                  variant="contained"
                                  startIcon={<KeyboardReturn />}
                                  color="warning"
                                  onClick={() => handleOnClickConfirm()}
                                >
                                  Trả hàng
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<Close />}
                                  color="error"
                                  onClick={() => handleOnClickCancel()}
                                >
                                  Huỷ phiếu trả hàng
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
            <Card>Thông tin phiếu xuất kho</Card>
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
                                      <TableCell>Mã sản phẩm</TableCell>
                                      <TableCell>Tên sản phẩm</TableCell>
                                      <TableCell>Đơn vị</TableCell>
                                      <TableCell align="center">Số lượng</TableCell>
                                      <TableCell align="center">Đơn giá</TableCell>
                                      <TableCell align="center">Thành tiền</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {productList.length > 0 &&
                                      productList.map((product, index) => (
                                        <Fragment key={index}>
                                          <TableRow
                                            hover
                                            //   selected={islistProductselected}
                                            selected={false}
                                          >
                                            {/* TODO: Sửa phần index khi phân trang */}
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{product?.productCode}</TableCell>
                                            <TableCell>{product?.productName}</TableCell>
                                            <TableCell>
                                              {product?.wrapUnitMeasure == null ? (
                                                product?.unitMeasure
                                              ) : (
                                                <Box
                                                  className={classes.selectBoxUnitMeasure}
                                                >
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
                                                              `productList[${index}].consignmentList[${indexConsignment}].quantityReturn`,
                                                              FormatDataUtils.getRoundFloorNumber(
                                                                consignment.quantityReturn /
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
                                                              `productList[${index}].consignmentList[${indexConsignment}].quantityReturn`,
                                                              FormatDataUtils.getRoundFloorNumber(
                                                                consignment.quantityReturn *
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
                                                </Box>
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {calculateTotalQuantityOfProduct(
                                                values?.productList[index],
                                              )}
                                              {values.productList[index]
                                                .selectedUnitMeasure ===
                                                product.wrapUnitMeasure &&
                                                !!product.wrapUnitMeasure && (
                                                  <Tooltip
                                                    title={
                                                      calculateTotalQuantityOfProduct(
                                                        values?.productList[index],
                                                      ) -
                                                      (calculateTotalQuantityOfProduct(
                                                        values?.productList[index],
                                                      ) %
                                                        1) +
                                                      ' ' +
                                                      product.wrapUnitMeasure +
                                                      ' ' +
                                                      Math.round(
                                                        (calculateTotalQuantityOfProduct(
                                                          values?.productList[index],
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
                                                      calculateTotalQuantityOfProduct(
                                                        values.productList[index],
                                                      ) * product.numberOfWrapUnitMeasure,
                                                    )
                                                  : calculateTotalQuantityOfProduct(
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
                                                    <TableCell>Vị trí</TableCell>
                                                    <TableCell>Ngày nhập</TableCell>
                                                    <TableCell>Hạn lưu kho</TableCell>
                                                    <TableCell align="center">
                                                      Trả về
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      Số lượng trên đơn hàng
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
                                                          {consignment?.importDate
                                                            ? FormatDataUtils.formatDate(
                                                                consignment?.importDate,
                                                              )
                                                            : 'Không có'}
                                                        </TableCell>
                                                        <TableCell>
                                                          {consignment?.expirationDate
                                                            ? FormatDataUtils.formatDate(
                                                                consignment?.expirationDate,
                                                              )
                                                            : 'Không có'}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                          <TextfieldWrapper
                                                            name={`productList[${index}].consignmentList[${indexConsignment}].quantityReturn`}
                                                            variant="standard"
                                                            className="text-field-quantity"
                                                            type={'number'}
                                                            InputProps={{
                                                              inputProps: {
                                                                min: 0,
                                                                max: consignment?.quantity,
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
                                                              <Tooltip
                                                                title={
                                                                  values.productList[
                                                                    index
                                                                  ].consignmentList[
                                                                    indexConsignment
                                                                  ].quantityReturn -
                                                                  (values.productList[
                                                                    index
                                                                  ].consignmentList[
                                                                    indexConsignment
                                                                  ].quantityReturn %
                                                                    1) +
                                                                  ' ' +
                                                                  product.wrapUnitMeasure +
                                                                  ' ' +
                                                                  Math.floor(
                                                                    (values.productList[
                                                                      index
                                                                    ].consignmentList[
                                                                      indexConsignment
                                                                    ].quantityReturn %
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
                                                            ? FormatDataUtils.getRoundFloorNumber(
                                                                consignment?.quantity /
                                                                  product.numberOfWrapUnitMeasure,
                                                                2,
                                                              )
                                                            : consignment?.quantity}
                                                          {values.productList[index]
                                                            .selectedUnitMeasure ===
                                                            product.wrapUnitMeasure &&
                                                            !!product.wrapUnitMeasure && (
                                                              <Tooltip
                                                                title={
                                                                  consignment?.quantity /
                                                                    product.numberOfWrapUnitMeasure -
                                                                  ((consignment?.quantity /
                                                                    product.numberOfWrapUnitMeasure) %
                                                                    1) +
                                                                  ' ' +
                                                                  product.wrapUnitMeasure +
                                                                  ' ' +
                                                                  Math.floor(
                                                                    ((consignment?.quantity /
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
                                <Typography variant="h6">Thông tin xác nhận</Typography>
                                <Typography>
                                  Người tạo đơn: <i>{exportOrder.createBy}</i>
                                </Typography>
                                <Typography>Ngày tạo đơn:</Typography>
                                <Typography>
                                  {FormatDataUtils.formatDateTime(exportOrder.createDate)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid
                            xs={12}
                            item
                          >
                            <Card>
                              <CardContent className={classes.warehourseInfo}>
                                <Typography variant="h6">Trả về kho</Typography>
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
                  title="Tổng giá trị đơn hàng"
                /> */}
                              <CardContent className={classes.orderNote}>
                                <Typography variant="h6">Ghi chú</Typography>
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
                  title="Tổng giá trị đơn hàng"
                /> */}
                                <Typography variant="h6">
                                  Tổng giá trị đơn hàng
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
                        title={errorMessage ? 'Chú ý' : title}
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

export default ReturnGoods;
