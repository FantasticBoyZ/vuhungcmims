import FormatDataUtils from '@/utils/formatData';
import { Add, Close, Edit, KeyboardReturn } from '@mui/icons-material';
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
import { Fragment, useEffect } from 'react';
import { Form, Formik } from 'formik';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';

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
  const navigate = useNavigate();
  const classes = useStyles();
  const productList = exportOrder.productList;

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = exportOrder?.productList;
    for (let index = 0; index < productList.length; index++) {
      totalAmount =
        totalAmount + +productList[index]?.quantity * +productList[index]?.unitPrice;
    }
    return totalAmount;
  };

  useEffect(() => {
    if (exportOrder?.statusName !== 'completed') {
      navigate(`/export/detail/${exportOrderId}`);
    }
  }, []);

  return (
    <Box>
      {!!exportOrder && (
        <Formik
          initialValues={{ ...exportOrder }}
          // validationSchema={FORM_VALIDATION}
          // onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors, setFieldValue }) => (
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
                          {exportOrder.billReferenceNumber}
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
                            onClick={() => navigate(`/export/return/${exportOrderId}`)}
                          >
                            Trả hàng
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={<Close />}
                            color="error"
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
                                <TableCell align="center">Đơn giá</TableCell>
                                <TableCell align="center">Thành tiền</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {productList.map((product, index) => (
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
                                      {FormatDataUtils.formatCurrency(
                                        product?.unitPrice || '0',
                                      )}
                                    </TableCell>
                                    <TableCell align="center">
                                      {FormatDataUtils.formatCurrency(
                                        product?.quantity * product?.unitPrice,
                                      )}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow className={classes.rowConsignment}>
                                    <TableCell
                                      className={classes.tableCellConsignment}
                                    ></TableCell>
                                    <TableCell
                                      colSpan={4}
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
                                            <TableCell align="center">Trả về</TableCell>
                                            <TableCell align="center">
                                              Số lượng trên đơn hàng
                                            </TableCell>
                                          </TableRow>
                                          {product?.consignments.map(
                                            (consignment, indexConsignment) => (
                                              <TableRow
                                                key={indexConsignment}
                                                // hover
                                              >
                                                <TableCell>
                                                  {consignment?.warehourseName}
                                                </TableCell>
                                                <TableCell>
                                                  {consignment?.importDate}
                                                </TableCell>
                                                <TableCell>
                                                  {consignment?.expirationDate}
                                                </TableCell>
                                                <TableCell align="center">
                                                  <TextfieldWrapper
                                                    name={`productList[${index}].consignments[${indexConsignment}].quantityReturn`}
                                                    variant="standard"
                                                    className="text-field-quantity"
                                                    type={'number'}
                                                    InputProps={{
                                                      inputProps: {
                                                        min: 0,
                                                        max: consignment?.quantity,
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
                                                  {consignment?.quantity}
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
                            Người tạo đơn: <i>{exportOrder.creatorName}</i>
                          </Typography>
                          <Typography>Ngày tạo đơn:</Typography>
                          <Typography>
                            {FormatDataUtils.formatDateTime(exportOrder.createdDate)}
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
                          <Typography>{exportOrder.warehourseName}</Typography>
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
                          <Typography>{exportOrder.description}</Typography>
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
                          <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                          <br />
                          <Typography align="right">
                            {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default ReturnGoods;
