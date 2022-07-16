import FormatDataUtils from '@/utils/formatData';
import { Add, Close, Done, Edit, KeyboardReturn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const valueFormik = useRef();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
      product?.consignmentList.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return totalQuantity;
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = valueFormik.current.productList;
    console.log(valueFormik.current.productList);
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        totalAmount =
          totalAmount +
          calculateTotalQuantityOfProduct(productList[index]) *
            +productList[index]?.unitPrice;
      }
    }
    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setTitle('Bạn có chắc chắn muốn lưu lại chỉnh sửa không?');
    setMessage('Hãy kiểm tra kỹ thông tin trước khi xác nhận.');
    setErrorMessage(null);
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy tất cả những chỉnh sửa không?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.productList;
      let consignmentExports = [];
      console.log('xác nhận', values);

      for (let index = 0; index < productList.length; index++) {
        if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
          setErrorMessage('Bạn có sản phẩm chưa nhập số lượng');
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
          if (consignment.quantity >= 0) {
            consignmentExports.push({
              id: consignment.id,
              quantity: consignment.quantity,
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
        try {
          const response = await dispatch(updateExportOrder(editedExportOrder));
          const resultResponse = unwrapResult(response);
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success('Sửa phiếu xuất hàng thành công');
            }

            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log('Failed to save export order: ', error);
          toast.error('Sửa phiếu xuất hàng thất bại');
        }
      } else {
        setErrorMessage('Bạn không có lô hàng nào thoả mãn điều kiện xuất hàng');
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
        if (dataResult.data.inforExportDetail?.statusName !== 'pending') {
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
              initialValues={{ ...exportOrder, productList: [...productList] }}
              // validationSchema={FORM_VALIDATION}
              onSubmit={(values) => handleConfirm(values)}
            >
              {({ values, errors, setFieldValue }) => {
                valueFormik.current = values;
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
                                <strong>Phiếu xuất kho số:</strong>{' '}
                                {exportOrder.billRefernce}
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
                                  Lưu chỉnh sửa
                                </Button>
                                <Button
                                  variant="contained"
                                  startIcon={<Close />}
                                  color="error"
                                  onClick={() => handleOnClickCancel()}
                                >
                                  Huỷ chỉnh sửa
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
                                    {!!productList &&
                                      productList.length > 0 &&
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
                                            <TableCell>{product?.unitMeasure}</TableCell>
                                            <TableCell align="center">
                                              {calculateTotalQuantityOfProduct(
                                                values.productList[index],
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {FormatDataUtils.formatCurrency(
                                                product?.unitPrice || '0',
                                              )}
                                            </TableCell>
                                            <TableCell align="center">
                                              {FormatDataUtils.formatCurrency(
                                                calculateTotalQuantityOfProduct(
                                                  values.productList[index],
                                                ) * product?.unitPrice,
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
                                                      Số lượng
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      Tồn kho
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
                                                            : 'Không có'}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                          <TextfieldWrapper
                                                            name={`productList[${index}].consignmentList[${indexConsignment}].quantity`}
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
                                                            //     `productList[${index}].consignments[${indexConsignment}].quantityReturn`,
                                                            //     e?.target.value,
                                                            //   );
                                                            // }}
                                                          />
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
                                <Typography variant="h6">Kho lấy hàng</Typography>
                                <Typography>{exportOrder.wareHouseName}</Typography>
                                <Divider />
                                <Typography>{exportOrder.addressDetail}</Typography>
                                <Typography>
                                  {exportOrder.wardName} - {exportOrder.districtName} -{' '}
                                  {exportOrder.provinceName}
                                </Typography>
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
                      <pre>{JSON.stringify(values, null, 2)}</pre>
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
